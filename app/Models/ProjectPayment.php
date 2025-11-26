<?php

namespace App\Models;

use App\Traits\LogActivity;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ProjectPayment extends Model
{
    use HasUuids, LogActivity;

    protected $guarded = [];
    protected $appends = ['amount_formatted', 'type_desc'];
    
    protected function typeDesc(): Attribute
    {
        return Attribute::get(fn() => [
            '00' => 'Payment',
            '01' => 'Additional',
        ][$this->type] ?? 'Unknown');
    }
    function project(){
        return $this->belongsTo(Project::class, 'project_id', 'id');
    }

    public function getAmountFormattedAttribute()
    {
        return 'Rp ' . number_format($this->amount);
    }

    function projectPaymentLog() {
        return $this->hasMany(ProjectPaymentLog::class, 'project_payment_id', 'id');
    }
}
