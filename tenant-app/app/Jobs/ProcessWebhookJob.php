<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Services\Wms\WmsWebhookHandler;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

final class ProcessWebhookJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 30;

    public function __construct(
        private readonly string $eventType,
        private readonly array $data,
    ) {
        $this->onQueue('webhooks');
    }

    public function handle(WmsWebhookHandler $webhookHandler): void
    {
        Log::info('Processing webhook job', [
            'event_type' => $this->eventType,
        ]);

        try {
            $webhookHandler->handle($this->eventType, $this->data);

            Log::info('Webhook processed successfully', [
                'event_type' => $this->eventType,
            ]);

        } catch (\Throwable $e) {
            Log::error('Webhook processing failed', [
                'event_type' => $this->eventType,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
