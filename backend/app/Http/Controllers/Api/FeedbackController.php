<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\NotifikasiFeedbackKurang;
use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Throwable;

/**
 * Store feedback and dispatch a job for negative ratings.
 */
class FeedbackController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'resi' => ['required', 'string', 'regex:/^[a-zA-Z0-9]{32}$/'],
            'membantu' => ['required', 'boolean:strict'],
            'catatan' => ['nullable', 'string', 'max:255'],
        ], [
            'resi.required' => 'Nomor resi wajib diisi.',
            'resi.regex' => 'Nomor resi harus berupa 32 karakter alfanumerik.',
            'membantu.required' => 'Penilaian wajib diisi.',
            'membantu.boolean' => 'Nilai membantu harus true atau false.',
        ]);

        $feedback = Feedback::create($validated);

        if ($feedback->membantu === false) {
            $notificationKey = 'feedback:notification:'.$feedback->resi;

            if (Cache::add($notificationKey, true, now()->addHour())) {
                try {
                    NotifikasiFeedbackKurang::dispatch((int) $feedback->getKey());
                } catch (Throwable $exception) {
                    Cache::forget($notificationKey);

                    throw $exception;
                }
            }
        }

        return response()->json([
            'ok' => true,
            'message' => 'Terima kasih atas masukan Anda.',
            'feedback_id' => $feedback->getKey(),
        ], 201);
    }
}
