<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TelemetryData extends Model
{
    protected $table = 'telemetry_data';
    protected $primaryKey = 'telemetry_id';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'speed_kmh' => 'float',
            'accuracy_percentage' => 'float',
            'is_gps_active' => 'boolean',
            'waiting_time_minutes' => 'integer',
            'observed_at' => 'datetime',
        ];
    }

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class, 'waybill_number', 'waybill_number');
    }
}
