<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ProjectBoard extends Model
{
    use HasUuids;

    protected $guarded = [];
}
