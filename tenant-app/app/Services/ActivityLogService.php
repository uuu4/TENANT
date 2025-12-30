<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class ActivityLogService
{
    /**
     * Log an activity.
     */
    public function log(
        string $action,
        ?Model $model = null,
        array $data = [],
        ?array $oldValues = null,
        ?array $newValues = null
    ): ActivityLog {
        $user = Auth::user();

        $logData = [
            'user_id' => $user?->id,
            'user_email' => $user?->email,
            'user_name' => $user?->name,
            'action' => $action,
            'model_type' => $model ? class_basename($model) : null,
            'model_id' => $model?->getKey(),
            'model_name' => $model->name ?? $model->title ?? null,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'metadata' => $data,
        ];

        return ActivityLog::create($logData);
    }

    /**
     * Log user authentication events.
     */
    public function logAuth(string $action, ?int $userId = null): ActivityLog
    {
        $user = Auth::user();

        return ActivityLog::create([
            'user_id' => $userId ?? $user?->id,
            'user_email' => $user?->email,
            'user_name' => $user?->name,
            'action' => $action,
            'model_type' => 'User',
            'model_id' => $userId ?? $user?->id,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    /**
     * Log model creation.
     */
    public function logCreated(Model $model, array $data = []): ActivityLog
    {
        return $this->log(
            'created',
            $model,
            $data,
            null,
            $model->getAttributes()
        );
    }

    /**
     * Log model update with changes.
     */
    public function logUpdated(Model $model, array $oldValues = [], array $data = []): ActivityLog
    {
        return $this->log(
            'updated',
            $model,
            $data,
            $oldValues,
            $model->getChanges()
        );
    }

    /**
     * Log model deletion.
     */
    public function logDeleted(Model $model, array $data = []): ActivityLog
    {
        return $this->log(
            'deleted',
            $model,
            $data,
            $model->getAttributes(),
            null
        );
    }

    /**
     * Log a view event.
     */
    public function logViewed(Model $model, array $data = []): ActivityLog
    {
        return $this->log('viewed', $model, $data);
    }

    /**
     * Get recent activity logs.
     */
    public function getRecent(int $limit = 50)
    {
        return ActivityLog::orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get logs for a specific user.
     */
    public function getForUser(int $userId, int $limit = 50)
    {
        return ActivityLog::forUser($userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get logs for a specific model.
     */
    public function getForModel(string $modelType, ?string $modelId = null, int $limit = 50)
    {
        return ActivityLog::forModel($modelType, $modelId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get activity statistics.
     */
    public function getStats(): array
    {
        $today = now()->startOfDay();
        $week = now()->subDays(7);

        return [
            'total' => ActivityLog::count(),
            'today' => ActivityLog::where('created_at', '>=', $today)->count(),
            'this_week' => ActivityLog::where('created_at', '>=', $week)->count(),
            'by_action' => ActivityLog::raw(function ($collection) {
                return $collection->aggregate([
                    ['$group' => ['_id' => '$action', 'count' => ['$sum' => 1]]],
                    ['$sort' => ['count' => -1]],
                    ['$limit' => 10],
                ]);
            })->toArray(),
        ];
    }
}
