<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    protected $table = 'feedback';

    protected $fillable = [
        'resi',
        'membantu',
        'catatan',
    ];

    protected function casts(): array
    {
        return [
            'membantu' => 'boolean',
        ];
    }
}
