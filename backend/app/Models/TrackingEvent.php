<?php

namespace App\Models;

use App\Jobs\NotifikasiStatusTracking;
use App\Support\CacheAman;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class TrackingEvent extends Model
{
    protected $table = 'tracking_events';

    protected $primaryKey = 'event_id';

    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'event_code',
        'milestone_stage',
        'description',
        'facility_name',
        'event_at',
    ];

    protected function casts(): array
    {
        return [
            'event_at' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        static::saved(function (self $event): void {
            $waybillNumber = $event->order_id;

            DB::afterCommit(function () use ($waybillNumber): void {
                self::clearTrackingCache($waybillNumber);
            });
        });

        static::created(function (self $event): void {
            if ($event->event_code === 'OUT_FOR_DELIVERY') {
                NotifikasiStatusTracking::dispatch($event->order_id)->afterCommit();
            }
        });

        static::deleted(function (self $event): void {
            self::clearTrackingCache($event->order_id);
        });
    }

    private static function clearTrackingCache(string $waybillNumber): void
    {
        CacheAman::lupa(
            'tracking:waybill:'.$waybillNumber,
            'tracking:waybill:not-found:'.$waybillNumber,
        );
    }
}
