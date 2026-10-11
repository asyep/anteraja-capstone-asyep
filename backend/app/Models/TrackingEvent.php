<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * =============================================================================
 * TrackingEvent.php - Model Log Peristiwa & Milestone Pengiriman Paket
 * =============================================================================
 * FUNGSI UTAMA:
 * Menyimpan catatan kronologis setiap checkpoint operasional logistik yang dilalui paket
 * (misal: pesanan dibuat, dijemput kurir, tiba di hub transit, keluar pengantaran, selesai).
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Kronologi Riwayat:
 *    Setiap rekaman memiliki `event_at` yang diurutkan secara kronologis untuk
 *    menampilkan kartu "Catatan Perjalanan Detil" (*Journey Notes*) di antarmuka pengguna.
 * 2. Pemetaan Milestone Stage:
 *    Kolom `milestone_stage` mengelompokkan event ke dalam 5 status visual utama.
 * 3. Informasi Fasilitas:
 *    Menyimpan `facility_name` (nama hub transit / staging store) dan deskripsi aktivitas.
 * =============================================================================
 */
class TrackingEvent extends Model
{
    protected $primaryKey = 'event_id';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'event_at' => 'datetime',
        ];
    }

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class, 'waybill_number', 'waybill_number');
    }
}
