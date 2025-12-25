<?php

declare(strict_types=1);

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessWebhookJob;
use App\Services\Wms\WmsWebhookHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

final class WmsWebhookController extends Controller
{
    public function __construct(
        private readonly WmsWebhookHandler $webhookHandler,
    ) {}

    public function handle(Request $request): JsonResponse
    {
        // Validate webhook signature
        $signature = $request->header('X-WMS-Signature', '');
        $payload = $request->getContent();

        if (!$this->webhookHandler->validateSignature($payload, $signature)) {
            Log::warning('Invalid WMS webhook signature', [
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'Invalid signature',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $eventType = $request->input('event_type');
        $data = $request->input('data', []);

        if (empty($eventType)) {
            return response()->json([
                'message' => 'Missing event_type',
            ], Response::HTTP_BAD_REQUEST);
        }

        Log::info('WMS webhook received', [
            'event_type' => $eventType,
            'ip' => $request->ip(),
        ]);

        // Dispatch to queue for async processing
        ProcessWebhookJob::dispatch($eventType, $data);

        return response()->json([
            'message' => 'Webhook received',
            'event_type' => $eventType,
        ], Response::HTTP_ACCEPTED);
    }
}
