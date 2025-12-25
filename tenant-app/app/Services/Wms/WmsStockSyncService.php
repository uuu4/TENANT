<?php

declare(strict_types=1);

namespace App\Services\Wms;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class WmsStockSyncService
{
    private const string CACHE_TAG = 'products';

    /**
     * Update stock for a single product
     */
    public function updateStock(string $sku, int $quantity): bool
    {
        try {
            $updated = Product::query()
                ->where('sku', $sku)
                ->update([
                    'stock_quantity' => max(0, $quantity),
                    'stock_synced_at' => now(),
                ]);

            if ($updated > 0) {
                $this->invalidateCache($sku);
                return true;
            }

            Log::info('SKU not found for stock update', ['sku' => $sku]);
            return false;

        } catch (\Throwable $e) {
            Log::error('Failed to update stock', [
                'sku' => $sku,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Update price for a single product
     */
    public function updatePrice(string $sku, ?float $priceUsd, ?float $priceEur): bool
    {
        try {
            $updates = ['stock_synced_at' => now()];

            if ($priceUsd !== null) {
                $updates['price_usd'] = round($priceUsd, 2);
            }

            if ($priceEur !== null) {
                $updates['price_eur'] = round($priceEur, 2);
            }

            $updated = Product::query()
                ->where('sku', $sku)
                ->update($updates);

            if ($updated > 0) {
                $this->invalidateCache($sku);
                return true;
            }

            return false;

        } catch (\Throwable $e) {
            Log::error('Failed to update price', [
                'sku' => $sku,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Bulk sync stock from WMS data
     * 
     * @param array<int, array{sku: string, quantity: int, price_usd?: float, price_eur?: float}> $items
     * @return array{processed: int, failed: int, errors: array}
     */
    public function bulkSync(array $items): array
    {
        $processed = 0;
        $failed = 0;
        $errors = [];

        $batchSize = config('wms.batch_size', 100);
        $chunks = array_chunk($items, $batchSize);

        foreach ($chunks as $chunk) {
            DB::beginTransaction();

            try {
                foreach ($chunk as $item) {
                    if (!$this->validateItem($item)) {
                        $failed++;
                        $errors[] = [
                            'sku' => $item['sku'] ?? 'unknown',
                            'message' => 'Invalid data format',
                        ];
                        continue;
                    }

                    $updated = Product::query()
                        ->where('sku', $item['sku'])
                        ->update([
                            'stock_quantity' => max(0, (int) $item['quantity']),
                            'price_usd' => isset($item['price_usd']) 
                                ? round((float) $item['price_usd'], 2) 
                                : DB::raw('price_usd'),
                            'price_eur' => isset($item['price_eur']) 
                                ? round((float) $item['price_eur'], 2) 
                                : DB::raw('price_eur'),
                            'stock_synced_at' => now(),
                        ]);

                    if ($updated > 0) {
                        $processed++;
                    }
                }

                DB::commit();

            } catch (\Throwable $e) {
                DB::rollBack();
                $failed += count($chunk);
                $errors[] = [
                    'message' => 'Batch failed: ' . $e->getMessage(),
                ];
                Log::error('Bulk sync batch failed', ['error' => $e->getMessage()]);
            }
        }

        // Invalidate cache after bulk sync
        $this->invalidateAllCache();

        return [
            'processed' => $processed,
            'failed' => $failed,
            'errors' => $errors,
        ];
    }

    private function validateItem(array $item): bool
    {
        if (empty($item['sku']) || !is_string($item['sku'])) {
            return false;
        }

        if (!isset($item['quantity']) || !is_numeric($item['quantity'])) {
            return false;
        }

        return true;
    }

    private function invalidateCache(string $sku): void
    {
        Cache::forget("product:{$sku}");
    }

    private function invalidateAllCache(): void
    {
        Cache::tags([self::CACHE_TAG])->flush();
    }
}
