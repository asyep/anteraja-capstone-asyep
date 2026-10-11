<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * =============================================================================
 * FeedbackController.php - Controller Pencatatan Umpan Balik Narasi AI
 * =============================================================================
 * FUNGSI UTAMA:
 * Menerima dan menyimpan evaluasi pengguna (Bermanfaat / Kurang Bermanfaat)
 * terhadap narasi status pengiriman yang dihasilkan oleh AI Satria.
 *
 * SEKILAS PENJELASAN LOGIKA:
 * 1. Validasi Input Resi:
 *    Nomor resi wajib berupa 14 digit angka dan harus terdaftar di tabel `shipments`.
 * 2. Evaluasi Biner:
 *    Nilai `membantu` berupa boolean (true untuk jempol atas, false untuk jempol bawah).
 * 3. Analitik Kualitas AI:
 *    Data ini digunakan sebagai metrik performa efektivitas narasi AI dalam
 *    mengurangi volume tiket komplain WISMO (Where Is My Order).
 * =============================================================================
 */
class FeedbackController extends Controller
{
    /**
     * POST /api/v1/feedback
     * Menyimpan penilaian pengguna terhadap kejelasan narasi asisten AI.
     *
     * @param Request $request Request HTTP berisi data feedback
     * @return JsonResponse Konfirmasi penyimpanan feedback beserta data yang tersimpan
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Validasi ketat format resi dan keberadaannya di database
        $validated = $request->validate([
            'resi' => ['required', 'string', 'regex:/^\d{14}$/', 'exists:shipments,waybill_number'],
            'membantu' => ['required', 'boolean'],
            'catatan' => ['nullable', 'string', 'max:255'],
        ], [
            'resi.regex' => 'Nomor resi harus 14 digit angka.',
            'resi.exists' => 'Nomor resi tidak ditemukan.',
        ]);

        // 2. Simpan record umpan balik ke database
        $feedback = Feedback::create($validated);

        // 3. Kembalikan response sukses (HTTP 201 Created)
        return response()->json([
            'ok' => true,
            'message' => 'Terima kasih, feedback Anda tersimpan.',
            'data' => $feedback->only(['id', 'resi', 'membantu', 'catatan', 'created_at']),
        ], 201);
    }
}
