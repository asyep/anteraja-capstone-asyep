<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiNarrative extends Model
{
    protected $primaryKey = 'narrative_id';

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_fallback' => 'boolean',
            'generated_at' => 'datetime',
        ];
    }

    public function shipment(): BelongsTo
    {
        return $this->belongsTo(Shipment::class, 'waybill_number', 'waybill_number');
    }
}
