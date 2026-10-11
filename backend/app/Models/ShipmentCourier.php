<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * =============================================================================
 * ShipmentCourier.php - Model Pivot Penugasan Kurir ke Kiriman Paket
 * =============================================================================
 * FUNGSI UTAMA:
 * Menghubungkan resi `shipments` dengan kurir `couriers` beserta atribut penugasan.
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Tracking Status Kurir Aktif:
 *    Kolom `is_active` (boolean) menentukan kurir mana yang saat ini sedang aktif
 *    membawa paket di jalan, sehingga frontend dapat menampilkan kurir yang tepat.
 * 2. Waktu Penugasan:
 *    Kolom `assigned_at` mencatat waktu penyerahan paket ke kurir bersangkutan.
 * =============================================================================
 */
class ShipmentCourier extends Pivot
{
    protected $table = 'shipment_couriers';
    public $incrementing = false;
    public $timestamps = false;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }
}
