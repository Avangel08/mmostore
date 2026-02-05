<?php

namespace App\Models\MySQL;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CurrencyRates extends Model
{
    const STATUS = [
        'ACTIVE' => 'ACTIVE',
        'INACTIVE' => 'INACTIVE',
    ];

    const STATUS_LIST = [
        'ACTIVE' => "Active",
        'INACTIVE' => "Inactive",
    ];

    protected $connection = 'mysql';
    protected $table = 'currency_rates';

    protected $fillable = [
        'to_vnd',
        'date',
        'status'
    ];

    public function scopeFilterRateRange($query, $request)
    {
        if (isset($request['rateMin']) && $request['rateMin'] != '') {
            $query->where('to_vnd', '>=', (float) $request['rateMin']);
        }

        if (isset($request['rateMax']) && $request['rateMax'] != '') {
            $query->where('to_vnd', '<=', (float) $request['rateMax']);
        }

        return $query;
    }

    public function scopeFilterEffectiveDate($query, $request)
    {

        if (isset($request['effectiveDateStart']) && $request['effectiveDateStart'] != '') {
            $query->where('date', '>=', $request['effectiveDateStart']);
        }
        if (isset($request['effectiveDateEnd']) && $request['effectiveDateEnd'] != '') {
            $query->where('date', '<=', $request['effectiveDateEnd']);
        }
        return $query;
    }

    public function scopeFilterCreatedDate($query, $request)
    {
        try {
            if (!empty($request['createdDateStart'])) {
                $start = Carbon::parse($request['createdDateStart'])->startOfDay();
                $query->where('created_at', '>=', $start);
            }

            if (!empty($request['createdDateEnd'])) {
                $end = Carbon::parse($request['createdDateEnd'])->endOfDay();
                $query->where('created_at', '<=', $end);
            }
        } catch (\Exception $e) {
        }

        return $query;
    }
}
