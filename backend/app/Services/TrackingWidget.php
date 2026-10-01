<?php

declare(strict_types=1);

namespace App\Services;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;

class TrackingWidget
{
    public function dataWidget(string $waybillNumber): ?array
    {
        $summary = DB::table('tracking_summary')
            ->where('waybill_number', $waybillNumber)
            ->first();

        if (! $summary) {
            return null;
        }

        $events = DB::table('tracking_events')
            ->where('order_id', $waybillNumber)
            ->orderBy('event_at')
            ->get();

        $delayReason = $summary->logistics_delay_reason ?? 'None';

        return [
            'waybill_number' => $summary->waybill_number,
            'order_status' => $summary->order_status,
            'seller_city' => $summary->seller_city,
            'customer_city' => $summary->customer_city,
            'item_total' => (float) ($summary->item_total ?? 0),
            'freight_total' => (float) ($summary->freight_total ?? 0),
            'has_free_shipping' => (bool) ($summary->has_free_shipping ?? false),
            'order_purchase_timestamp' => $summary->order_purchase_timestamp,
            'order_delivered_carrier_date' => $summary->order_delivered_carrier_date,
            'order_delivered_customer_date' => $summary->order_delivered_customer_date,
            'order_estimated_delivery_date' => $summary->order_estimated_delivery_date,
            'logistics_delay_reason' => $delayReason,
            'traffic_status' => $summary->traffic_status ?? 'Unknown',
            'waiting_time_minutes' => (int) ($summary->waiting_time_minutes ?? 0),
            'has_delay' => $delayReason !== 'None',
            'events' => $events->map(fn (object $event): array => [
                'event_code' => $event->event_code,
                'milestone_stage' => $event->milestone_stage,
                'description' => $event->description ?: $this->statusRamah($event->event_code),
                'facility_name' => $event->facility_name,
                'event_at' => $event->event_at,
            ])->all(),
        ];
    }

    public function statusRamah(string $kode): string
    {
        return config('status.terjemahan.'.$kode, 'Status paket sedang diperbarui.');
    }

    public function riwayatSingkat(string $waybillNumber): array
    {
        $events = DB::table('tracking_events')
            ->where('order_id', $waybillNumber)
            ->orderBy('event_at')
            ->get();

        return $events->map(fn (object $event): array => [
            'kode' => $event->event_code,
            'tahap' => $event->milestone_stage,
            'pesan' => $event->description ?: $this->statusRamah($event->event_code),
            'lokasi' => $event->facility_name,
            'event_at' => CarbonImmutable::parse($event->event_at)
                ->setTimezone('Asia/Jakarta')
                ->toIso8601String(),
            'formatted_at' => CarbonImmutable::parse($event->event_at)
                ->setTimezone('Asia/Jakarta')
                ->locale('id')
                ->translatedFormat('d M Y, H:i').' WIB',
        ])->all();
    }
}
