<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ReportAccountSeller extends Model
{
    protected $connection = 'mysql';
    protected $table = 'report_account_seller';

    protected $fillable = [
        'store_id',
        'live_count',
        'sold_count',
        'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'live_count' => 'integer',
        'sold_count' => 'integer',
    ];

    public function store()
    {
        return $this->belongsTo(Stores::class, 'store_id');
    }

    public function scopeLatestPerStore($query)
    {
        return $query->whereIn('id', function ($subQuery) {
            $subQuery->select('report_account_seller.id')
                ->from('report_account_seller')
                ->join(
                    DB::raw('(SELECT store_id, MAX(recorded_at) AS recorded_at FROM report_account_seller GROUP BY store_id) latest'),
                    function ($join) {
                        $join->on('report_account_seller.store_id', '=', 'latest.store_id')
                            ->on('report_account_seller.recorded_at', '=', 'latest.recorded_at');
                    }
                );
        });
    }
}
