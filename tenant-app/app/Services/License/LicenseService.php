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
        $this->timeout = config('license.timeout', 10);
    }

    public function validate(string $licenseKey, string $domain): LicenseResponse
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->post($this->providerUrl . $this->validationEndpoint, [
                    'license_key' => $licenseKey,
                    'domain' => $domain,
                    'app_version' => config('app.version', '1.0.0'),
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

            $expiresAt = isset($data['expires_at']) 
                ? Carbon::parse($data['expires_at']) 
                : null;

            return LicenseResponse::valid(
                expiresAt: $expiresAt,
                features: $data['features'] ?? null,
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
