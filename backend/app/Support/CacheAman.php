<?php

namespace App\Support;

use Closure;
use Illuminate\Support\Facades\Cache;
use Throwable;

class CacheAman
{
    public static function ingat(string $key, int $seconds, Closure $callback): mixed
    {
        $cache = Cache::store('tracking');
        $computed = false;
        $result = null;
        $callbackError = null;

        $resolver = function () use ($callback, &$computed, &$result, &$callbackError): mixed {
            try {
                $result = $callback();
                $computed = true;

                return $result;
            } catch (Throwable $exception) {
                $callbackError = $exception;

                throw $exception;
            }
        };

        try {
            return $cache->lock('lock:'.$key, 10)->block(2, function () use ($cache, $key, $seconds, $resolver): mixed {
                return $cache->remember($key, $seconds, $resolver);
            });
        } catch (Throwable $exception) {
            if ($callbackError !== null) {
                throw $callbackError;
            }

            if ($computed) {
                return $result;
            }

            return $callback();
        }
    }

    public static function ada(string $key): bool
    {
        try {
            return Cache::store('tracking')->has($key);
        } catch (Throwable) {
            return false;
        }
    }

    public static function lupa(string ...$keys): void
    {
        $cache = Cache::store('tracking');

        foreach ($keys as $key) {
            try {
                $cache->forget($key);
            } catch (Throwable) {
                // The source data remains authoritative if cache invalidation is unavailable.
            }
        }
    }
}
