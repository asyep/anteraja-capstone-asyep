<?php

declare(strict_types=1);

namespace App\Services;

use Carbon\CarbonImmutable;

class MilestoneMapperService
{
    private const STAGES = [
        'ORDER_CREATED' => 'Pesanan Dibuat',
        'PICKUP_READY' => 'Diproses Kurir',
        'IN_TRANSIT' => 'Dalam Perjalanan',
        'DELIVERED' => 'Tiba di Tujuan',
    ];

    public function map(array $shipment): array
    {
        $eventsByStage = [];

        foreach ($shipment['events'] ?? [] as $event) {
            $stage = $event['milestone_stage'] ?? null;

            if ($stage !== null && isset(self::STAGES[$stage])) {
                $eventsByStage[$stage] = $event;
            }
        }

        $timestamps = [
            'ORDER_CREATED' => $shipment['order_purchase_timestamp']
                ?? $eventsByStage['ORDER_CREATED']['event_at']
                ?? null,
            'PICKUP_READY' => $shipment['order_delivered_carrier_date']
                ?? $eventsByStage['PICKUP_READY']['event_at']
                ?? null,
            'IN_TRANSIT' => $eventsByStage['IN_TRANSIT']['event_at'] ?? null,
            'DELIVERED' => $shipment['order_delivered_customer_date']
                ?? $eventsByStage['DELIVERED']['event_at']
                ?? null,
        ];

        $orderStatus = strtolower((string) ($shipment['order_status'] ?? ''));
        $delivered = $timestamps['DELIVERED'] !== null || $orderStatus === 'delivered';
        $inTransit = in_array($orderStatus, ['in_transit', 'shipped'], true) || $delivered;
        $currentStage = match (true) {
            $delivered => 'DELIVERED',
            $inTransit => 'IN_TRANSIT',
            $timestamps['PICKUP_READY'] !== null => 'PICKUP_READY',
            default => 'ORDER_CREATED',
        };

        $milestones = [];

        foreach (self::STAGES as $code => $label) {
            $timestamp = $timestamps[$code];
            $completed = $timestamp !== null
                || ($code === 'IN_TRANSIT' && $inTransit)
                || ($code === 'DELIVERED' && $delivered);

            $milestones[] = [
                'stage' => $code,
                'label' => $label,
                'status' => $completed ? 'completed' : 'pending',
                'completed' => $completed,
                'current' => $code === $currentStage,
                'timestamp' => $timestamp === null ? null : $this->isoWib($timestamp),
                'formatted_timestamp' => $timestamp === null ? null : $this->formatTimestamp($timestamp),
            ];
        }

        $delayReason = trim((string) ($shipment['logistics_delay_reason'] ?? 'None'));
        $trafficStatus = strtolower((string) ($shipment['traffic_status'] ?? ''));
        $eta = $this->calculateEta(
            $shipment['order_estimated_delivery_date'] ?? null,
            (int) ($shipment['waiting_time_minutes'] ?? 0),
        );

        return [
            'milestone_stages' => $milestones,
            'current_milestone_stage' => $currentStage,
            'has_delay' => ($delayReason !== '' && strcasecmp($delayReason, 'None') !== 0)
                || in_array($trafficStatus, ['heavy', 'detour'], true),
            'order_estimated_delivery_date' => $eta['iso'],
            'formatted_eta' => $eta['formatted'],
            'eta_at' => $eta['iso'],
        ];
    }

    private function calculateEta(mixed $date, int $waitingMinutes): array
    {
        if ($date === null || $date === '') {
            return ['iso' => null, 'formatted' => null];
        }

        $eta = CarbonImmutable::parse((string) $date, 'Asia/Jakarta')
            ->setTimezone('Asia/Jakarta')
            ->setTime(18, 0)
            ->addMinutes(max(0, $waitingMinutes));

        return [
            'iso' => $eta->toIso8601String(),
            'formatted' => $eta->locale('id')->translatedFormat('d F Y, H:i').' WIB',
        ];
    }

    private function isoWib(mixed $timestamp): string
    {
        return CarbonImmutable::parse((string) $timestamp)
            ->setTimezone('Asia/Jakarta')
            ->toIso8601String();
    }

    private function formatTimestamp(mixed $timestamp): string
    {
        return CarbonImmutable::parse((string) $timestamp)
            ->setTimezone('Asia/Jakarta')
            ->locale('id')
            ->translatedFormat('d M Y, H:i').' WIB';
    }
}
