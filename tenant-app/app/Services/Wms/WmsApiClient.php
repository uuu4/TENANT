<?php

declare(strict_types=1);

namespace App\Services\Wms;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class WmsApiClient
{
    private readonly string $apiUrl;
    private readonly string $apiKey;
    private readonly int $timeout;

    public function __construct()
    {
        $this->apiUrl = config('wms.api_url');
        $this->apiKey = config('wms.api_key');
        $this->timeout = config('wms.timeout', 30);
    }

    /**
     * Fetch stock levels from WMS
     * 
     * @return array<int, array{sku: string, quantity: int, price_usd?: float, price_eur?: float}>
     */
    public function fetchStockLevels(): array
    {
        try {
            $response = $this->makeRequest('GET', '/stock');

            if (!$response->successful()) {
                Log::warning('WMS stock fetch failed', [
                    'status' => $response->status(),
                ]);
                return [];
            }

            return $response->json('data') ?? [];

        } catch (\Throwable $e) {
            Log::error('WMS API request failed', [
                'endpoint' => '/stock',
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Fetch products from WMS
     * 
     * @return array<int, array{sku: string, name: string, brand?: string, category?: string}>
     */
    public function fetchProducts(): array
    {
        try {
            $response = $this->makeRequest('GET', '/products');

            if (!$response->successful()) {
                Log::warning('WMS products fetch failed', [
                    'status' => $response->status(),
                ]);
                return [];
            }

            return $response->json('data') ?? [];

        } catch (\Throwable $e) {
            Log::error('WMS API request failed', [
                'endpoint' => '/products',
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Fetch brands from WMS
     * 
     * @return array<int, array{id: string, name: string, logo_url?: string}>
     */
    public function fetchBrands(): array
    {
        try {
            $response = $this->makeRequest('GET', '/brands');

            if (!$response->successful()) {
                Log::warning('WMS brands fetch failed', [
                    'status' => $response->status(),
                ]);
                return [];
            }

            return $response->json('data') ?? [];

        } catch (\Throwable $e) {
            Log::error('WMS API request failed', [
                'endpoint' => '/brands',
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    private function makeRequest(string $method, string $endpoint): \Illuminate\Http\Client\Response
    {
        return Http::timeout($this->timeout)
            ->withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json',
            ])
            ->$method($this->apiUrl . $endpoint);
    }
}
