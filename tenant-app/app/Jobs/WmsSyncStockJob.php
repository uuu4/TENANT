<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Enums\SyncType;
use App\Services\Wms\WmsApiClient;
use App\Services\Wms\WmsStockSyncService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class WmsSyncStockJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        private readonly SyncType $syncType = SyncType::STOCK,
    ) {
        $this->onQueue('wms-sync');
    }

    public function handle(WmsApiClient $wmsClient, WmsStockSyncService $syncService): void
    {
        $syncLogId = $this->startSyncLog();

        try {
            Log::info('Starting WMS stock sync job');

            $wmsData = $wmsClient->fetchStockLevels();

            if (empty($wmsData)) {
                $this->completeSyncLog($syncLogId, 0, 0);
                Log::info('WMS sync completed with no data');
                return;
            }

            $result = $syncService->bulkSync($wmsData);

            $this->completeSyncLog($syncLogId, $result['processed'], $result['failed']);

            Log::info('WMS stock sync completed', [
                'processed' => $result['processed'],
                'failed' => $result['failed'],
            ]);

        } catch (\Throwable $e) {
            $this->failSyncLog($syncLogId, $e);

            Log::error('WMS Stock sync failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e; // Re-throw to trigger retry
        }
    }

    private function startSyncLog(): ?string
    {
        try {
            $id = DB::connection('mongodb')
                ->collection('sync_logs')
                ->insertGetId([
                    'sync_type' => $this->syncType->value,
                    'source' => 'scheduled',
                    'status' => 'started',
                    'started_at' => now()->toIso8601String(),
                ]);

            return (string) $id;
        } catch (\Throwable $e) {
            Log::warning('Failed to create sync log', ['error' => $e->getMessage()]);
            return null;
        }
    }

    private function completeSyncLog(?string $logId, int $processed, int $failed): void
    {
        if (!$logId) return;

        try {
            DB::connection('mongodb')
                ->collection('sync_logs')
                ->where('_id', $logId)
                ->update([
                    'status' => 'completed',
                    'records_processed' => $processed,
                    'records_failed' => $failed,
                    'completed_at' => now()->toIso8601String(),
                ]);
        } catch (\Throwable $e) {
            Log::warning('Failed to update sync log', ['error' => $e->getMessage()]);
        }
    }

    private function failSyncLog(?string $logId, \Throwable $e): void
    {
        if (!$logId) return;

        try {
            DB::connection('mongodb')
                ->collection('sync_logs')
                ->where('_id', $logId)
                ->update([
                    'status' => 'failed',
                    'errors' => [['message' => $e->getMessage()]],
                    'completed_at' => now()->toIso8601String(),
                ]);
        } catch (\Throwable $ex) {
            Log::warning('Failed to update sync log', ['error' => $ex->getMessage()]);
        }
    }
}
