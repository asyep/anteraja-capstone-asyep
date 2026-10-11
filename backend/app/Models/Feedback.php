<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * =============================================================================
 * Feedback.php - Model Persistensi Penilaian Kepuasan Pengguna terhadap AI
 * =============================================================================
 * FUNGSI UTAMA:
 * Menyimpan respon penilaian pengguna ("Ya / Tidak" membantu) terhadap narasi AI.
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Atribut Fillable:
 *    `resi` (nomor waybill terkait), `membantu` (boolean), dan `catatan` opsional.
 * 2. Analisis Efektivitas AI:
 *    Menjadi sumber data evaluasi untuk mengukur reduksi tiket keluhan pelanggan.
 * =============================================================================
 */
class Feedback extends Model
{
    protected $table = 'feedback';

    protected $fillable = ['resi', 'membantu', 'catatan'];

    protected function casts(): array
    {
        return [
            'membantu' => 'boolean',
        ];
    }
}
