<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * FeedbackController
 *
 * Menggantikan feedback.php dari php-api lama.
 * Perbedaan: feedback disimpan ke storage Laravel (storage/app/feedback.txt)
 * atau dapat diperluas ke database di tahap berikutnya.
 *
 * Route:
 *   POST /api/feedback
 *
 * Body JSON:
 *   { "resi": "...", "membantu": true|false }
 */
class FeedbackController extends Controller
{
    /**
     * Menyimpan feedback pengguna terhadap narasi AI.
     * Menggantikan feedback.php.
     *
     * POST /api/feedback
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'resi'     => ['required', 'string', 'size:32'],
            'membantu' => ['required', 'boolean'],
        ], [
            'resi.required'     => 'Nomor resi wajib diisi.',
            'resi.size'         => 'Nomor resi harus persis 32 karakter.',
            'membantu.required' => 'Penilaian wajib diisi.',
            'membantu.boolean'  => 'Nilai membantu harus true atau false.',
        ]);

        $jawaban = $validated['membantu'] ? 'ya' : 'tidak';
        $baris   = now()->format('Y-m-d H:i:s')
                   . ' | ' . $validated['resi']
                   . ' | ' . $jawaban
                   . PHP_EOL;

        // Simpan ke storage/app/feedback/feedback.txt (append)
        // Ganti Storage::append dengan model Feedback untuk produksi
        Storage::append('feedback/feedback.txt', rtrim($baris));

        return response()->json([
            'ok'    => true,
            'pesan' => 'Terima kasih atas masukanmu.',
        ]);
    }
}
