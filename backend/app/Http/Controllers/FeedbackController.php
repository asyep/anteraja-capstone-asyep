<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    /**
     * POST /api/v1/feedback
     * Simpan penilaian "membantu / tidak" untuk narasi AI suatu resi.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'resi' => ['required', 'string', 'regex:/^\d{14}$/', 'exists:shipments,waybill_number'],
            'membantu' => ['required', 'boolean'],
            'catatan' => ['nullable', 'string', 'max:255'],
        ], [
            'resi.regex' => 'Nomor resi harus 14 digit angka.',
            'resi.exists' => 'Nomor resi tidak ditemukan.',
        ]);

        $feedback = Feedback::create($validated);

        return response()->json([
            'ok' => true,
            'message' => 'Terima kasih, feedback Anda tersimpan.',
            'data' => $feedback->only(['id', 'resi', 'membantu', 'catatan', 'created_at']),
        ], 201);
    }
}
