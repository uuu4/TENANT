<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Services\ActivityLogService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ActivityLogController extends Controller
{
    public function __construct(
        protected ActivityLogService $logService
    ) {}

    /**
     * Get paginated activity logs with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = ActivityLog::query();

        // Filter by action
        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', (int) $request->user_id);
        }

        // Filter by model type
        if ($request->filled('model_type')) {
            $query->where('model_type', $request->model_type);
        }

        // Filter by date range
        if ($request->filled('from')) {
            $query->where('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->where('created_at', '<=', $request->to);
        }

        // Search in model_name or user_email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('model_name', 'like', "%{$search}%")
                  ->orWhere('user_email', 'like', "%{$search}%")
                  ->orWhere('user_name', 'like', "%{$search}%");
            });
        }

        $logs = $query->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 20);

        return response()->json($logs);
    }

    /**
     * Get a specific activity log.
     */
    public function show(string $id): JsonResponse
    {
        $log = ActivityLog::findOrFail($id);
        return response()->json($log);
    }

    /**
     * Get activity statistics.
     */
    public function stats(): JsonResponse
    {
        $stats = $this->logService->getStats();
        return response()->json($stats);
    }

    /**
     * Get logs for a specific user.
     */
    public function forUser(int $userId): JsonResponse
    {
        $logs = $this->logService->getForUser($userId);
        return response()->json($logs);
    }

    /**
     * Get logs for a specific model.
     */
    public function forModel(string $modelType, ?string $modelId = null): JsonResponse
    {
        $logs = $this->logService->getForModel($modelType, $modelId);
        return response()->json($logs);
    }

    /**
     * Get recent activity logs.
     */
    public function recent(Request $request): JsonResponse
    {
        $limit = $request->limit ?? 50;
        $logs = $this->logService->getRecent($limit);
        return response()->json($logs);
    }

    /**
     * Get available action types.
     */
    public function actions(): JsonResponse
    {
        $actions = ActivityLog::distinct('action')->pluck('action');
        return response()->json($actions);
    }

    /**
     * Get available model types.
     */
    public function modelTypes(): JsonResponse
    {
        $types = ActivityLog::distinct('model_type')->pluck('model_type');
        return response()->json($types);
    }
}
