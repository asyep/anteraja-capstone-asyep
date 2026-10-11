<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * =============================================================================
 * Shipment.php - Model Entitas Inti Pengiriman Paket (Aggregate Root)
 * =============================================================================
 * FUNGSI UTAMA:
 * Merepresentasikan data pengiriman paket Anteraja dan menjadi pusat relasi
 * terhadap data logistik lainnya (telemetri, riwayat event, kurir, dan narasi AI).
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Kunci Utama Non-Numerik (String Waybill):
 *    Menggunakan `waybill_number` (14 digit) sebagai primary key unik bertipe string.
 * 2. Siklus 5 Milestone Logistik:
 *    Mendefinisikan konstanta status dari pembuatan resi hingga paket diterima:
 *    `ORDER_CREATED` -> `PICKUP_READY` -> `IN_TRANSIT` -> `OUT_FOR_DELIVERY` -> `DELIVERED`.
 * 3. Logika Skenario Tampilan Antarmuka (`scenario()`):
 *    - `delivered`: Paket sudah sampai ke penerima.
 *    - `warning`: Paket tertunda karena kendala cuaca/jalan/delay operasional.
 *    - `live`: Paket sedang bergerak dalam transit dengan pemancar GPS aktif.
 *    - `normal`: Tampilan standar progres perjalanan paket.
 * 4. Helper Logistik:
 *    Menyediakan method evaluasi cepat seperti `hasDelay()`, `activeCourier()`,
 *    dan ekstraksi kota dari alamat penerima/pengirim (`cityFromAddress()`).
 * =============================================================================
 */
class Shipment extends Model
{
    public const STATUS_ORDER_CREATED = 'ORDER_CREATED';
    public const STATUS_PICKUP_READY = 'PICKUP_READY';
    public const STATUS_IN_TRANSIT = 'IN_TRANSIT';
    public const STATUS_OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY';
    public const STATUS_DELIVERED = 'DELIVERED';
    public const STATUS_NOT_FOUND = 'NOT_FOUND';

    /** Urutan milestone yang ditampilkan pada stepper frontend. */
    public const MILESTONES = [
        self::STATUS_ORDER_CREATED,
        self::STATUS_PICKUP_READY,
        self::STATUS_IN_TRANSIT,
        self::STATUS_OUT_FOR_DELIVERY,
        self::STATUS_DELIVERED,
    ];

    protected $primaryKey = 'waybill_number';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'weight_kg' => 'float',
            'volume_m3' => 'float',
            'insurance_status' => 'boolean',
            'is_free_shipping' => 'boolean',
            'has_sla_guarantee' => 'boolean',
            'purchase_date' => 'datetime',
            'estimated_delivery_date' => 'datetime',
            'delivered_date' => 'datetime',
        ];
    }

    public function trackingEvents(): HasMany
    {
        return $this->hasMany(TrackingEvent::class, 'waybill_number', 'waybill_number')
            ->orderBy('event_at');
    }

    public function telemetry(): HasOne
    {
        return $this->hasOne(TelemetryData::class, 'waybill_number', 'waybill_number');
    }

    public function aiNarratives(): HasMany
    {
        return $this->hasMany(AiNarrative::class, 'waybill_number', 'waybill_number');
    }

    public function latestNarrative(): HasOne
    {
        return $this->hasOne(AiNarrative::class, 'waybill_number', 'waybill_number')
            ->latestOfMany('generated_at');
    }

    public function couriers(): BelongsToMany
    {
        return $this->belongsToMany(Courier::class, 'shipment_couriers', 'waybill_number', 'courier_id')
            ->using(ShipmentCourier::class)
            ->withPivot(['assigned_at', 'is_active']);
    }

    /** Kurir yang sedang aktif menangani kiriman (jika ada). */
    public function activeCourier(): ?Courier
    {
        return $this->couriers
            ->sortByDesc(fn (Courier $courier) => $courier->pivot->assigned_at)
            ->first(fn (Courier $courier) => (bool) $courier->pivot->is_active)
            ?? $this->couriers->sortByDesc(fn (Courier $courier) => $courier->pivot->assigned_at)->first();
    }

    /** Kiriman dianggap terlambat bila ada alasan delay logistik atau lalu lintas padat. */
    public function hasDelay(): bool
    {
        if ($this->shipment_status === self::STATUS_DELIVERED) {
            return false;
        }

        $telemetry = $this->telemetry;

        return $telemetry !== null
            && (filled($telemetry->logistics_delay_reason) || $telemetry->traffic_status === 'Heavy');
    }

    /**
     * Skenario tampilan frontend:
     * delivered → halaman Delivered, warning → halaman peringatan jalur,
     * live → halaman peta GPS, normal → halaman tracking standar.
     */
    public function scenario(): string
    {
        if ($this->shipment_status === self::STATUS_DELIVERED) {
            return 'delivered';
        }

        if ($this->hasDelay()) {
            return 'warning';
        }

        if ($this->shipment_status === self::STATUS_IN_TRANSIT && $this->telemetry?->is_gps_active) {
            return 'live';
        }

        return 'normal';
    }

    /** Ambil nama kota dari alamat ("Jl. ..., Jakarta Pusat" → "Jakarta Pusat"). */
    public static function cityFromAddress(?string $address): string
    {
        if (blank($address)) {
            return '';
        }

        $parts = explode(',', $address);

        return trim(end($parts));
    }
}
