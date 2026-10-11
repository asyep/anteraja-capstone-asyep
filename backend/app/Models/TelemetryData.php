<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * =============================================================================
 * TelemetryData.php - Model Sensor IoT & Telemetri Perjalanan Armada
 * =============================================================================
 * FUNGSI UTAMA:
 * Menyimpan data sensor fisik dan kondisi lingkungan armada saat membawa paket
 * (koordinat GPS, kecepatan, kondisi cuaca, kepadatan lalu lintas, dan delay).
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Pelacakan Lokasi Nyata:
 *    Menyimpan koordinat `latitude` dan `longitude` untuk visualisasi peta interaktif
 *    Leaflet di frontend saat armada berada dalam mode transit aktif.
 * 2. Deteksi Kendala Otomatis:
 *    Kolom `traffic_status` ('Heavy', 'Moderate', 'Clear') dan `logistics_delay_reason`
 *    menjadi pemicu (*trigger*) kemunculan banner peringatan operasional (warning banner).
 * 3. Type Casting Numerik & Boolean:
 *    Mengonversi kolom geografis menjadi float presisi tinggi dan status GPS ke boolean.
 * =============================================================================
 */
class TelemetryData extends Model
{
    protected $table = 'telemetry_data';
    protected $primaryKey = 'telemetry_id';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'speed_kmh' => 'float',
            'accuracy_percentage' => 'float',
            'is_gps_active' => 'boolean',
            'waiting_time_minutes' => 'integer',
            'observed_at' => 'datetime',
        ];
    }

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class, 'waybill_number', 'waybill_number');
    }
}
