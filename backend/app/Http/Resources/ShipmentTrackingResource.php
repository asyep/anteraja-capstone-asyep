<?php

namespace App\Http\Resources;

use App\Models\Courier;
use App\Models\Shipment;
use App\Models\TrackingEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * =============================================================================
 * ShipmentTrackingResource.php - API Resource Detail Pelacakan Paket
 * =============================================================================
 * FUNGSI UTAMA:
 * Mentransformasikan model `Shipment` beserta seluruh relasi (events, telemetry,
 * narrative, couriers) menjadi payload JSON standar yang dikonsumsi oleh widget.
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Struktur Ganda (Flat & Nested):
 *    - Field Datar (Level Atas): `waybill_number`, `order_status`, `seller_city`, dll.
 *      mempertahankan kompatibilitas dengan frontend API normalizer.
 *    - Objek Bersarang (Nested Objects): `shipment`, `courier`, `telemetry`,
 *      `milestone_stages`, `tracking_events`, dan `ai_narrative` melayani kartu-kartu
 *      komponen individual di halaman pelacakan.
 * 2. Visual Milestone Stepper (5 Tahapan):
 *    Menghitung progres kiriman ke dalam 5 status visual: `ORDER_CREATED`,
 *    `PICKUP_READY`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, dan `DELIVERED`.
 *    Setiap tahap ditandai dengan status `completed`, `current`, atau `pending`.
 * 3. Integrasi Kurir & Telemetri IoT:
 *    Membentuk tautan direct chat WhatsApp kurir aktif (`https://wa.me/...`)
 *    dan mengekstrak koordinat GPS, cuaca, kecepatan armada, serta alasan keterlambatan.
 * =============================================================================
 *
 * @mixin Shipment
 */
class ShipmentTrackingResource extends JsonResource
{
    /** Label & estimasi SLA layanan berdasarkan kode pengiriman Anteraja */
    private const SERVICES = [
        'AR-SD' => ['label' => 'Same Day', 'sla' => 'Tiba di hari yang sama'],
        'AR-NDR' => ['label' => 'Next Day', 'sla' => '1 Hari Kerja'],
        'AR-REG' => ['label' => 'Reguler', 'sla' => '2-3 Hari Kerja'],
        'AR-ECO' => ['label' => 'Ekonomis', 'sla' => '3-5 Hari Kerja'],
    ];

    /**
     * Mengubah resource model menjadi representasi array terstruktur.
     *
     * @param Request $request Request HTTP yang masuk
     * @return array Struktur data JSON lengkap untuk antarmuka tracking
     */
    public function toArray(Request $request): array
    {
        /** @var Shipment $shipment */
        $shipment = $this->resource;
        $events = $shipment->trackingEvents;
        $telemetry = $shipment->telemetry;
        $narrative = $shipment->latestNarrative;
        $courier = $shipment->activeCourier();

        // Helper untuk mencari timestamp event pertama per milestone stage
        $firstEventAt = fn (string $stage) => $events->firstWhere('milestone_stage', $stage)?->event_at;
        // Waktu update terakhir diambil dari event terbaru atau pengamatan sensor telemetri
        $lastUpdated = collect([$events->max('event_at'), $telemetry?->observed_at])->filter()->max();

        return [
            // --- Field datar (kompatibel dengan normalizeShipment) ---
            'waybill_number' => $shipment->waybill_number,
            'order_status' => $shipment->shipment_status,
            'current_milestone_stage' => $shipment->shipment_status,
            'scenario' => $shipment->scenario(),
            'seller_city' => Shipment::cityFromAddress($shipment->sender_address),
            'customer_city' => Shipment::cityFromAddress($shipment->receiver_address),
            'order_purchase_timestamp' => $shipment->purchase_date?->toIso8601String(),
            'order_delivered_carrier_date' => $firstEventAt(Shipment::STATUS_PICKUP_READY)?->toIso8601String(),
            'in_transit_timestamp' => $firstEventAt(Shipment::STATUS_IN_TRANSIT)?->toIso8601String(),
            'out_for_delivery_timestamp' => $firstEventAt(Shipment::STATUS_OUT_FOR_DELIVERY)?->toIso8601String(),
            'order_estimated_delivery_date' => $shipment->estimated_delivery_date?->toIso8601String(),
            'order_delivered_customer_date' => $shipment->delivered_date?->toIso8601String(),
            'last_updated_at' => $lastUpdated?->toIso8601String(),
            'has_delay' => $shipment->hasDelay(),
            'logistics_delay_reason' => $telemetry?->logistics_delay_reason,
            'traffic_status' => $telemetry?->traffic_status,

            // --- Detail paket ---
            'shipment' => [
                'service_type' => $shipment->service_type,
                'service' => $this->service($shipment->service_type),
                'sender' => [
                    'name' => $shipment->sender_name,
                    'address' => $shipment->sender_address,
                    'city' => Shipment::cityFromAddress($shipment->sender_address),
                ],
                'receiver' => [
                    'name' => $shipment->receiver_name,
                    'address' => $shipment->receiver_address,
                    'city' => Shipment::cityFromAddress($shipment->receiver_address),
                ],
                'weight_kg' => $shipment->weight_kg,
                'volume_m3' => $shipment->volume_m3,
                'insurance_status' => $shipment->insurance_status,
                'insurance_type' => $shipment->insurance_type,
                'is_free_shipping' => $shipment->is_free_shipping,
                'has_sla_guarantee' => $shipment->has_sla_guarantee,
            ],

            'courier' => $courier ? $this->courier($courier) : null,

            'telemetry' => $telemetry ? [
                'latitude' => $telemetry->latitude,
                'longitude' => $telemetry->longitude,
                'speed_kmh' => $telemetry->speed_kmh,
                'location_name' => $telemetry->location_name,
                'accuracy_percentage' => $telemetry->accuracy_percentage,
                'is_gps_active' => $telemetry->is_gps_active,
                'traffic_status' => $telemetry->traffic_status,
                'weather_condition' => $telemetry->weather_condition,
                'logistics_delay_reason' => $telemetry->logistics_delay_reason,
                'waiting_time_minutes' => $telemetry->waiting_time_minutes,
                'observed_at' => $telemetry->observed_at?->toIso8601String(),
            ] : null,

            'milestone_stages' => $this->milestones($shipment),

            // Riwayat lengkap, terbaru di atas (untuk "Catatan Perjalanan Detil").
            'tracking_events' => $events->sortByDesc('event_at')->values()->map(
                fn (TrackingEvent $event) => [
                    'id' => $event->event_id,
                    'event_code' => trim($event->event_code, '[]'),
                    'milestone_stage' => $event->milestone_stage,
                    'title' => $event->title,
                    'description' => $event->description,
                    'facility_name' => $event->facility_name,
                    'event_at' => $event->event_at?->toIso8601String(),
                ],
            ),

            'ai_narrative' => $narrative ? [
                'title' => $narrative->ai_title,
                'subtitle' => $narrative->ai_subtitle,
                'text' => $narrative->narrative_text,
                'is_fallback' => $narrative->is_fallback,
                'provider' => $narrative->provider,
                'generation_status' => $narrative->generation_status,
                'generated_at' => $narrative->generated_at?->toIso8601String(),
            ] : null,
        ];
    }

    /**
     * Parsing kode layanan pengiriman menjadi metadata label dan SLA.
     *
     * @param string|null $serviceType Kode layanan mentah (misal: "AR-SD Same Day")
     * @return array Metadata kode, nama layanan, dan estimasi waktu sampai
     */
    private function service(?string $serviceType): array
    {
        $code = strtoupper(trim(strtok((string) $serviceType, ' ')));
        $meta = self::SERVICES[$code] ?? ['label' => $serviceType, 'sla' => null];

        return ['code' => $code, 'label' => $meta['label'], 'sla' => $meta['sla']];
    }

    /**
     * Memformat data kurir aktif dan membuat tautan direct chat WhatsApp resmi.
     *
     * @param Courier $courier Model kurir yang menangani paket
     * @return array Data kurir beserta foto, nomor kendaraan, dan link WhatsApp
     */
    private function courier(Courier $courier): array
    {
        $phone = preg_replace('/\D+/', '', (string) $courier->courier_phone);

        return [
            'id' => $courier->courier_id,
            'name' => $courier->courier_name,
            'phone' => $courier->courier_phone,
            'whatsapp_url' => $phone ? "https://wa.me/{$phone}" : null,
            'photo_url' => $courier->courier_photo_url,
            'vehicle_type' => $courier->vehicle_type,
            'vehicle_plate' => $courier->vehicle_plate,
            'assigned_at' => $courier->pivot?->assigned_at?->toIso8601String(),
            'is_active' => (bool) $courier->pivot?->is_active,
        ];
    }

    /**
     * Menyusun 5 tahapan visual milestone stepper beserta status completed/current/pending.
     *
     * @param Shipment $shipment Model data kiriman
     * @return array Daftar 5 tahapan visual milestone dengan timestamp dan fasilitas
     */
    private function milestones(Shipment $shipment): array
    {
        $events = $shipment->trackingEvents;
        $currentIndex = array_search($shipment->shipment_status, Shipment::MILESTONES, true);
        $currentIndex = $currentIndex === false ? -1 : $currentIndex;
        $isDelivered = $shipment->shipment_status === Shipment::STATUS_DELIVERED;

        return collect(Shipment::MILESTONES)->map(function (string $stage, int $index) use ($events, $currentIndex, $isDelivered, $shipment) {
            $stageEvents = $events->where('milestone_stage', $stage);
            $first = $stageEvents->first();
            $last = $stageEvents->last();

            $status = match (true) {
                $index < $currentIndex, $isDelivered && $index === $currentIndex => 'completed',
                $index === $currentIndex => 'current',
                default => 'pending',
            };

            $timestamp = $first?->event_at;
            if (! $timestamp && $stage === Shipment::STATUS_ORDER_CREATED) {
                $timestamp = $shipment->purchase_date;
            }
            if (! $timestamp && $stage === Shipment::STATUS_DELIVERED) {
                $timestamp = $shipment->delivered_date;
            }

            return [
                'stage' => $stage,
                'status' => $status,
                'timestamp' => $timestamp?->toIso8601String(),
                'facility_name' => ($last ?? $first)?->facility_name,
                'title' => ($last ?? $first)?->title,
            ];
        })->all();
    }
}
