<?php

declare(strict_types=1);

namespace App\Services\License;

use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class LicenseService
{
    private readonly string $providerUrl;
    private readonly string $validationEndpoint;
    private readonly int $timeout;

    public function __construct()
    {
        $this->providerUrl = config('license.provider_url');
        $this->validationEndpoint = config('license.validation_endpoint');
        $this->timeout = (int) config('license.timeout', 10);
    }

    public function validate(string $licenseKey, string $domain): LicenseResponse
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                    'X-License-Key' => $licenseKey,
                ])
                ->post($this->providerUrl . $this->validationEndpoint, [
                    'domain' => $domain,
                    'app_version' => config('app.version', '1.0.0'),
                    'php_version' => PHP_VERSION,
                ]);

            if (!$response->successful()) {
                Log::warning('License validation failed with status', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return LicenseResponse::invalid('License validation failed');
            }

            $data = $response->json();

            if (!isset($data['valid']) || !$data['valid']) {
                return LicenseResponse::invalid($data['message'] ?? 'Invalid license');
            }

            // Parse expires_at from license object in response
            $expiresAt = isset($data['license']['expires_at']) 
                ? Carbon::parse($data['license']['expires_at']) 
                : null;

            return LicenseResponse::valid(
                expiresAt: $expiresAt,
                features: $data['license'] ?? null,
            );

        } catch (\Throwable $e) {
            Log::error('License validation request failed', [
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function getCurrentVersion(): string
    {
        return config('app.version', '1.0.0');
    }
}
