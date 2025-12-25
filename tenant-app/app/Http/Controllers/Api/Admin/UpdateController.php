<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\Update\SelfUpdateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

final class UpdateController extends Controller
{
    public function __construct(
        private readonly SelfUpdateService $updateService,
    ) {}

    public function checkForUpdates(): JsonResponse
    {
        $updateInfo = $this->updateService->checkAvailableUpdates();

        return response()->json([
            'current_version' => $updateInfo['current'],
            'latest_version' => $updateInfo['latest'],
            'update_available' => $updateInfo['has_update'],
            'changelog' => $updateInfo['changelog'] ?? null,
        ]);
    }

    public function performUpdate(Request $request): JsonResponse
    {
        $currentVersion = $this->updateService->getCurrentVersion();

        Log::info('Update initiated', [
            'user_id' => $request->user()->id,
            'current_version' => $currentVersion,
        ]);

        try {
            // Step 1: Enable maintenance mode
            Artisan::call('down', [
                '--secret' => config('app.maintenance_secret', 'update-secret'),
                '--retry' => 60,
            ]);

            // Step 2: Create backup point
            $backupRef = $this->updateService->createBackupRef();

            // Step 3: Pull latest changes
            $pullResult = $this->updateService->pullLatestChanges();

            if (!$pullResult['success']) {
                $this->rollback($backupRef);
                return $this->errorResponse('Git pull failed: ' . ($pullResult['error'] ?? 'Unknown error'));
            }

            // Step 4: Install dependencies (if composer.lock changed)
            if ($pullResult['composer_changed']) {
                $composerResult = $this->updateService->installDependencies();

                if (!$composerResult['success']) {
                    $this->rollback($backupRef);
                    return $this->errorResponse('Composer install failed');
                }
            }

            // Step 5: Run migrations
            $migrationResult = $this->runMigrations();

            if (!$migrationResult['success']) {
                $this->rollback($backupRef);
                return $this->errorResponse('Migration failed: ' . ($migrationResult['error'] ?? 'Unknown error'));
            }

            // Step 6: Clear and rebuild caches
            $this->rebuildCaches();

            // Step 7: Disable maintenance mode
            Artisan::call('up');

            $newVersion = $this->updateService->getCurrentVersion();

            Log::info('Update completed successfully', [
                'old_version' => $currentVersion,
                'new_version' => $newVersion,
            ]);

            // Log to MongoDB
            $this->logSystemEvent('update.completed', [
                'old_version' => $currentVersion,
                'new_version' => $newVersion,
                'user_id' => $request->user()->id,
            ]);

            return response()->json([
                'success' => true,
                'old_version' => $currentVersion,
                'new_version' => $newVersion,
                'message' => 'Update completed successfully',
            ]);

        } catch (\Throwable $e) {
            Log::error('Update failed with exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Try to bring the system back up
            Artisan::call('up');

            return $this->errorResponse('Update failed: ' . $e->getMessage());
        }
    }

    /**
     * @return array{success: bool, output?: string, error?: string}
     */
    private function runMigrations(): array
    {
        try {
            Artisan::call('migrate', ['--force' => true]);
            return ['success' => true, 'output' => Artisan::output()];
        } catch (\Throwable $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    private function rebuildCaches(): void
    {
        Artisan::call('cache:clear');
        Artisan::call('config:cache');
        Artisan::call('route:cache');
        Artisan::call('view:cache');
    }

    private function rollback(string $backupRef): void
    {
        Log::warning('Rolling back update', ['backup_ref' => $backupRef]);

        try {
            $this->updateService->rollbackTo($backupRef);
            Artisan::call('migrate:rollback', ['--force' => true]);
            Artisan::call('up');
        } catch (\Throwable $e) {
            Log::critical('Rollback failed!', ['error' => $e->getMessage()]);
        }
    }

    private function errorResponse(string $message): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    private function logSystemEvent(string $event, array $details): void
    {
        try {
            DB::connection('mongodb')
                ->collection('system_events')
                ->insert([
                    'event' => $event,
                    'details' => $details,
                    'created_at' => now()->toIso8601String(),
                ]);
        } catch (\Throwable $e) {
            Log::warning('Failed to log system event', ['error' => $e->getMessage()]);
        }
    }
}
