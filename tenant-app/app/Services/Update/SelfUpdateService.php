<?php

declare(strict_types=1);

namespace App\Services\Update;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;

final class SelfUpdateService
{
    private readonly string $basePath;

    public function __construct()
    {
        $this->basePath = base_path();
    }

    public function getCurrentVersion(): string
    {
        return config('app.version', '1.0.0');
    }

    /**
     * Check for available updates from the remote repository
     * 
     * @return array{current: string, latest: string, has_update: bool, changelog?: string}
     */
    public function checkAvailableUpdates(): array
    {
        $currentVersion = $this->getCurrentVersion();

        try {
            // Fetch remote refs
            $fetchResult = Process::path($this->basePath)
                ->run('git fetch origin --tags');

            if (!$fetchResult->successful()) {
                Log::warning('Git fetch failed', ['output' => $fetchResult->errorOutput()]);
                return [
                    'current' => $currentVersion,
                    'latest' => $currentVersion,
                    'has_update' => false,
                ];
            }

            // Check if there are new commits
            $logResult = Process::path($this->basePath)
                ->run('git log HEAD..origin/main --oneline');

            $hasUpdate = !empty(trim($logResult->output()));

            // Get latest tag if exists
            $tagResult = Process::path($this->basePath)
                ->run('git describe --tags --abbrev=0 origin/main 2>/dev/null || echo ""');

            $latestVersion = trim($tagResult->output()) ?: $currentVersion;

            return [
                'current' => $currentVersion,
                'latest' => $latestVersion,
                'has_update' => $hasUpdate || $latestVersion !== $currentVersion,
                'changelog' => $hasUpdate ? $logResult->output() : null,
            ];

        } catch (\Throwable $e) {
            Log::error('Failed to check for updates', ['error' => $e->getMessage()]);
            return [
                'current' => $currentVersion,
                'latest' => $currentVersion,
                'has_update' => false,
            ];
        }
    }

    /**
     * Create a backup reference point before updating
     */
    public function createBackupRef(): string
    {
        $result = Process::path($this->basePath)
            ->run('git rev-parse HEAD');

        return trim($result->output());
    }

    /**
     * Pull latest changes from the remote repository
     * 
     * @return array{success: bool, composer_changed: bool, error?: string}
     */
    public function pullLatestChanges(): array
    {
        try {
            // Check if composer.lock will change
            $composerBefore = md5_file($this->basePath . '/composer.lock') ?: '';

            $result = Process::path($this->basePath)
                ->timeout(120)
                ->run('git pull origin main --ff-only');

            if (!$result->successful()) {
                return [
                    'success' => false,
                    'composer_changed' => false,
                    'error' => $result->errorOutput(),
                ];
            }

            $composerAfter = md5_file($this->basePath . '/composer.lock') ?: '';
            $composerChanged = $composerBefore !== $composerAfter;

            return [
                'success' => true,
                'composer_changed' => $composerChanged,
            ];

        } catch (\Throwable $e) {
            return [
                'success' => false,
                'composer_changed' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Install composer dependencies
     * 
     * @return array{success: bool, error?: string}
     */
    public function installDependencies(): array
    {
        try {
            $result = Process::path($this->basePath)
                ->timeout(300)
                ->run('composer install --no-dev --optimize-autoloader --no-interaction');

            if (!$result->successful()) {
                return [
                    'success' => false,
                    'error' => $result->errorOutput(),
                ];
            }

            return ['success' => true];

        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Rollback to a specific commit
     */
    public function rollbackTo(string $commitRef): bool
    {
        try {
            $result = Process::path($this->basePath)
                ->run("git reset --hard {$commitRef}");

            return $result->successful();

        } catch (\Throwable $e) {
            Log::error('Rollback failed', ['error' => $e->getMessage()]);
            return false;
        }
    }
}
