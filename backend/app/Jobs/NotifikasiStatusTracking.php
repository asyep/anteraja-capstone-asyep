<?php

namespace App\Jobs;

use App\Models\TrackingEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class NotifikasiStatusTracking implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public array $backoff = [10, 60];

    public int $timeout = 60;

    public function __construct(public string $waybillNumber) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $event = TrackingEvent::query()
            ->where('order_id', $this->waybillNumber)
            ->where('event_code', 'OUT_FOR_DELIVERY')
            ->latest('event_at')
            ->first(['event_code', 'event_at']);

        if ($event === null) {
            return;
        }

        Log::info('Notifikasi status pengiriman diproses.', [
            'waybill_number' => $this->waybillNumber,
            'event_code' => $event->event_code,
            'event_at' => $event->event_at?->toIso8601String(),
        ]);
    }

    public function failed(Throwable $exception): void
    {
        Log::error('Notifikasi status pengiriman gagal diproses.', [
            'waybill_number' => $this->waybillNumber,
            'exception' => $exception->getMessage(),
        ]);
    }
}
