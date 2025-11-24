<?php

namespace App\Models;

use App\Traits\LogActivity;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class FinanceTransaction extends Model
{
    use HasUuids, LogActivity;

    protected $guarded = [];

    protected $appends = ['amount_formatted'];
    public function getAmountFormattedAttribute()
    {
        return 'Rp ' . number_format($this->amount);
    }

    function financeType(){
        return $this->belongsTo(FinanceType::class, 'finance_type_id', 'id');
    }

    function financeCategory(){
        return $this->belongsTo(FinanceCategory::class, 'finance_category_id', 'id');
    }
}
