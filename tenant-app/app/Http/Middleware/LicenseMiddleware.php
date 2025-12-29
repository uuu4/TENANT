<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Exceptions\LicenseExpiredException;
use App\Services\License\LicenseService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

final readonly class LicenseMiddleware
{
    private const int CACHE_TTL_SECONDS = 3600; // 1 hour
    private const int GRACE_PERIOD_HOURS = 72;  // 3 days
    private const string CACHE_KEY_PREFIX = 'license_status_';
    private const string LAST_VALID_KEY_PREFIX = 'license_last_valid_';

    public function __construct(
        private LicenseService $licenseService,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        $licenseStatus = $this->getLicenseStatus();

        if ($licenseStatus['status'] === 'valid') {
            return $next($request);
        }

        if ($licenseStatus['status'] === 'grace_period') {
            Log::warning('License validation failed, operating in grace period', [
                'grace_until' => $licenseStatus['grace_until'],
            ]);
            return $next($request);
        }

        throw new LicenseExpiredException(
            message: 'License has expired or is invalid. Please contact support.',
        );
    }

    /**
     * Get cache key that includes license key hash
     * This ensures cache is invalidated when license key changes
     */
    private function getCacheKey(): string
    {
        $licenseKey = config('license.key');
        return self::CACHE_KEY_PREFIX . md5($licenseKey);
    }

    /**
     * Get last valid cache key that includes license key hash
     */
    private function getLastValidKey(): string
    {
        $licenseKey = config('license.key');
        return self::LAST_VALID_KEY_PREFIX . md5($licenseKey);
    }

    /**
     * @return array{status: string, expires_at: ?string, grace_until: ?string}
     */
    private function getLicenseStatus(): array
    {
        return Cache::remember(
            key: $this->getCacheKey(),
            ttl: self::CACHE_TTL_SECONDS,
            callback: fn(): array => $this->validateWithProvider()
        );
    }

    /**
     * @return array{status: string, expires_at: ?string, grace_until: ?string}
     */
    private function validateWithProvider(): array
    {
        try {
            $response = $this->licenseService->validate(
                licenseKey: config('license.key'),
                domain: config('app.url')
            );

            if ($response->isValid()) {
                // Store last valid check for grace period
                Cache::put($this->getLastValidKey(), [
                    'expires_at' => $response->expiresAt?->toIso8601String(),
                    'validated_at' => now()->toIso8601String(),
                ], now()->addDays(7));

                return [
                    'status' => 'valid',
                    'expires_at' => $response->expiresAt?->toIso8601String(),
                    'grace_until' => null,
                ];
            }

            return [
                'status' => 'expired',
                'expires_at' => $response->expiresAt?->toIso8601String(),
                'grace_until' => null,
            ];

        } catch (\Throwable $e) {
            Log::error('License server unreachable', [
                'error' => $e->getMessage(),
            ]);

            // Check if we have a previously valid license in grace period
            $cachedLicense = Cache::get($this->getLastValidKey());
            
            if ($cachedLicense && $this->isWithinGracePeriod($cachedLicense)) {
                return [
                    'status' => 'grace_period',
                    'expires_at' => $cachedLicense['expires_at'],
                    'grace_until' => now()
                        ->addHours(self::GRACE_PERIOD_HOURS)
                        ->toIso8601String(),
                ];
            }

            return [
                'status' => 'invalid',
                'expires_at' => null,
                'grace_until' => null,
            ];
        }
    }

    private function isWithinGracePeriod(array $cachedLicense): bool
    {
        $lastValidAt = \Carbon\Carbon::parse($cachedLicense['validated_at']);
        return $lastValidAt->addHours(self::GRACE_PERIOD_HOURS)->isFuture();
    }
}
