<?php

namespace App\Models;

use App\Traits\LogActivity;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasUuids, LogActivity;

    protected $guarded = [];
    protected $appends = ['status_desc', 'total_amount_formatted'];

    protected function statusDesc(): Attribute
    {
        return Attribute::get(fn() => [
            '00' => 'Closed',
            '01' => 'Running',
            '02' => 'Maintenance',
        ][$this->status] ?? 'Unknown');
    }

    public function getTotalAmountFormattedAttribute()
    {
        return 'Rp ' . number_format($this->total_amount);
    }

}
