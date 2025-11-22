<?php

namespace App\Models;

use App\Traits\LogActivity;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class FinanceType extends Model
{
    use HasUuids, LogActivity;

    protected $guarded = [];
}
