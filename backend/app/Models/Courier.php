<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * =============================================================================
 * Courier.php - Model Profil Kurir Satria Anteraja
 * =============================================================================
 * FUNGSI UTAMA:
 * Menyimpan data profil kurir (Satria) yang bertugas menangani penjemputan
 * maupun pengantaran paket kiriman langsung ke tangan pelanggan.
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Identitas Kurir:
 *    Menyimpan kode kurir `courier_id` (misal: `#JKT-88219`), nama, nomor telepon WhatsApp,
 *    tipe kendaraan (Motor / Blind Van / Armada Linehaul), dan plat nomor kendaraan.
 * 2. Relasi Banyak-ke-Banyak (Many-to-Many):
 *    Berelasi dengan `Shipment` melalui tabel pivot `shipment_couriers` dengan
 *    atribut tambahan `assigned_at` (waktu penugasan) dan `is_active` (status keaktifan).
 * =============================================================================
 */
class Courier extends Model
{
    protected $primaryKey = 'courier_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $guarded = [];

    public function shipments(): BelongsToMany
    {
        return $this->belongsToMany(Shipment::class, 'shipment_couriers', 'courier_id', 'waybill_number')
            ->using(ShipmentCourier::class)
            ->withPivot(['assigned_at', 'is_active']);
    }
}
