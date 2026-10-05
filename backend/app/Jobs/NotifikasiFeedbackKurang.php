<?php

namespace App\Jobs;

use App\Models\Feedback;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class NotifikasiFeedbackKurang implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public array $backoff = [10, 60];

    public function __construct(public int $feedbackId) {}

    public function handle(): void
    {
        $feedback = Feedback::find($this->feedbackId);

        if (! $feedback) {
            return;
        }

        if (app()->isLocal()) {
            sleep(2);
        }

        Log::warning('Pengguna menilai narasi tracking kurang membantu.', [
            'feedback_id' => $feedback->id,
            'resi' => $feedback->resi,
            'catatan' => $feedback->catatan,
        ]);
    }
}
