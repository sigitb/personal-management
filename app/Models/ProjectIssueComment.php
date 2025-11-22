<?php

namespace App\Models;

use App\Traits\LogActivity;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ProjectIssueComment extends Model
{
    use HasUuids,LogActivity;

    protected $guarded = [];
}
