<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrackingEvent extends Model
{
    protected $primaryKey = 'event_id';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'event_at' => 'datetime',
        ];
    }

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class, 'waybill_number', 'waybill_number');
    }
}
