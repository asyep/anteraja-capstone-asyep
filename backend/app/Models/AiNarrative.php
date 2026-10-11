<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * =============================================================================
 * AiNarrative.php - Model Persistensi Narasi Buatan Asisten AI (Satria)
 * =============================================================================
 * FUNGSI UTAMA:
 * Menyimpan riwayat teks narasi penjelasan status logistik yang dihasilkan
 * baik secara langsung via Google Gemini API maupun melalui Fallback Engine.
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Kunci Utama & Relasi:
 *    Menggunakan `narrative_id` sebagai primary key dan berelasi `belongsTo`
 *    dengan `Shipment` via kolom `waybill_number`.
 * 2. Audit Trail Generasi AI:
 *    Menyimpan metadata providensi: `provider` ('gemini'), `generation_status`
 *    ('success', 'fallback', 'error'), dan flag boolean `is_fallback`.
 * 3. Type Casting:
 *    Kolom `is_fallback` di-cast otomatis ke boolean, dan `generated_at` ke objek Carbon DateTime.
 * =============================================================================
 */
class AiNarrative extends Model
{
    protected $primaryKey = 'narrative_id';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_fallback' => 'boolean',
            'generated_at' => 'datetime',
        ];
    }

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class, 'waybill_number', 'waybill_number');
    }
}
