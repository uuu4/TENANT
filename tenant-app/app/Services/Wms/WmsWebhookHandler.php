<?php

declare(strict_types=1);

namespace App\Services\Wms;

use Illuminate\Support\Facades\Log;

final class WmsWebhookHandler
{
    public function __construct(
        private readonly WmsStockSyncService $stockSyncService,
    ) {}

    /**
     * Handle incoming webhook from WMS
     */
    public function handle(string $eventType, array $payload): void
    {
        Log::info('Processing WMS webhook', [
            'event_type' => $eventType,
        ]);

        match ($eventType) {
            'stock_updated' => $this->handleStockUpdate($payload),
            'price_updated' => $this->handlePriceUpdate($payload),
            'product_created' => $this->handleProductCreated($payload),
            'product_updated' => $this->handleProductUpdated($payload),
            default => Log::warning('Unknown WMS webhook event', ['type' => $eventType]),
        };
    }

    /**
     * Validate webhook signature
     */
    public function validateSignature(string $payload, string $signature): bool
    {
        $secret = config('wms.webhook_secret');
        
        if (empty($secret)) {
            Log::warning('WMS webhook secret not configured');
            return false;
        }

        $expectedSignature = hash_hmac('sha256', $payload, $secret);
        
        return hash_equals($expectedSignature, $signature);
    }

    private function handleStockUpdate(array $payload): void
    {
        $items = $payload['items'] ?? [];
        
        foreach ($items as $item) {
            if (isset($item['sku'], $item['quantity'])) {
                $this->stockSyncService->updateStock(
                    sku: $item['sku'],
                    quantity: (int) $item['quantity'],
                );
            }
        }
    }

    private function handlePriceUpdate(array $payload): void
    {
        $items = $payload['items'] ?? [];
        
        foreach ($items as $item) {
            if (isset($item['sku'])) {
                $this->stockSyncService->updatePrice(
                    sku: $item['sku'],
                    priceUsd: isset($item['price_usd']) ? (float) $item['price_usd'] : null,
                    priceEur: isset($item['price_eur']) ? (float) $item['price_eur'] : null,
                );
            }
        }
    }

    private function handleProductCreated(array $payload): void
    {
        Log::info('Product created webhook received', ['payload' => $payload]);
        // Handle product creation if needed
    }

    private function handleProductUpdated(array $payload): void
    {
        Log::info('Product updated webhook received', ['payload' => $payload]);
        // Handle product update if needed
    }
}
