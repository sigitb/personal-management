<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasUuids;
    public $timestamps = false;
    protected $guarded = [];

    protected $casts = [
        'before_data' => 'array',
        'after_data' => 'array',
    ];

}
