<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrackingEvent extends Model
{
    protected $table = 'tracking_events';

    protected $primaryKey = 'event_id';

    public $timestamps = false;

    protected function casts(): array
    {
        return [
            'event_at' => 'immutable_datetime',
        ];
    }
}
