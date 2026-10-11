<?php

namespace App\Http\Resources;

use App\Models\Shipment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * =============================================================================
 * ShipmentSummaryResource.php - API Resource Ringkasan Daftar Resi
 * =============================================================================
 * FUNGSI UTAMA:
 * Menyajikan representasi data kiriman yang ringkas, ringan, dan cepat untuk:
 * 1. Tabel / daftar riwayat kiriman pada endpoint `GET /api/v1/shipments`.
 * 2. Tombol chip uji coba sampel resi pada endpoint `GET /api/v1/shipments/samples`.
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Perataan Data (Data Flattening):
 *    Mengurangi beban transfer jaringan dengan hanya menyertakan atribut-atribut esensial
 *    (status, kota asal/tujuan, skenario visual, estimasi tiba, dan indikator keterlambatan).
 * 2. Perhitungan Skenario Ringkas:
 *    Mengikutsertakan flag `scenario` dan `has_delay` agar frontend dapat langsung
 *    memberikan badge warna status tanpa perlu mengkalkulasi ulang di browser.
 * =============================================================================
 *
 * @mixin Shipment
 */
class ShipmentSummaryResource extends JsonResource
{
    /**
     * Mengubah resource model menjadi array ringkasan kiriman.
     *
     * @param Request $request Request HTTP yang masuk
     * @return array Struktur data ringkasan kiriman
     */
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
