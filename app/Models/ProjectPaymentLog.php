<?php

namespace App\Models;

use App\Traits\LogActivity;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ProjectPaymentLog extends Model
{
    use HasUuids, LogActivity;

    public $timestamps = false;

    protected $guarded = [];

}
