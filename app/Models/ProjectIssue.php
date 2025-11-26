<?php

namespace App\Models;

use App\Traits\LogActivity;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ProjectIssue extends Model
{
    use HasUuids, LogActivity;

    protected $guarded = [];

    function project() {
        return $this->belongsTo(Project::class, 'project_id', 'id');
    }

    function projectBoard() {
        return $this->belongsTo(ProjectBoard::class, 'project_board_id', 'id');
    }

    function projectIssueLog(){
        return $this->hasMany(ProjectIssueLog::class, 'project_issue_id', 'id');
    }
}
