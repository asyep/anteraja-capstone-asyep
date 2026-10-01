<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class CatatWaktu
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startedAt = microtime(true);
        $response = $next($request);
        $durationMs = (microtime(true) - $startedAt) * 1000;

        $response->headers->set('X-Waktu-Ms', number_format($durationMs, 2, '.', ''));

        if ($durationMs > 500) {
            Log::warning('API request exceeded 500 ms.', [
                'method' => $request->method(),
                'path' => $request->path(),
                'duration_ms' => round($durationMs, 2),
            ]);
        }

        return $response;
    }
}
