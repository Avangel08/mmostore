<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class CurrencyRateSeller extends Model
{
    const STATUS = [
        'ACTIVE' => 1,
        'INACTIVE' => 0,
    ];

    protected $connection = 'tenant_mongo';
    protected $table = 'currency_rate_sellers';

    protected $fillable = [
        'to_vnd',
        'date',
        'status'
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    public function scopeFilterSearch($query, $request)
    {
        if (isset($request['search']) && $request['search'] != '') {
            $search = $request['search'];
            $query->where('to_vnd', 'like', '%' . $search . '%');
        }
        return $query;
    }

    public function scopeFilterDateRange($query, $request)
    {
        if (isset($request['start_time']) && $request['start_time'] != '') {
            $query->where('date', '>=', $request['start_time']);
        }
        if (isset($request['end_time']) && $request['end_time'] != '') {
            $query->where('date', '<=', $request['end_time']);
        }
        return $query;
    }
}
