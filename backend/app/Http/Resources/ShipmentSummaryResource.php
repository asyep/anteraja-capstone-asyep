<?php

namespace App\Http\Resources;

use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Ringkasan kiriman untuk daftar (riwayat, widget, contoh resi).
 *
 * @mixin Shipment
 */
class ShipmentSummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        /** @var Shipment $shipment */
        $shipment = $this->resource;

        return [
            'waybill_number' => $shipment->waybill_number,
            'order_status' => $shipment->shipment_status,
            'scenario' => $shipment->scenario(),
            'service_type' => $shipment->service_type,
            'sender_name' => $shipment->sender_name,
            'receiver_name' => $shipment->receiver_name,
            'seller_city' => Shipment::cityFromAddress($shipment->sender_address),
            'customer_city' => Shipment::cityFromAddress($shipment->receiver_address),
            'weight_kg' => $shipment->weight_kg,
            'has_delay' => $shipment->hasDelay(),
            'traffic_status' => $shipment->telemetry?->traffic_status,
            'logistics_delay_reason' => $shipment->telemetry?->logistics_delay_reason,
            'order_purchase_timestamp' => $shipment->purchase_date?->toIso8601String(),
            'order_estimated_delivery_date' => $shipment->estimated_delivery_date?->toIso8601String(),
            'order_delivered_customer_date' => $shipment->delivered_date?->toIso8601String(),
        ];
    }
}
