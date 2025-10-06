<?php

namespace App\Models\Mongo;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;

class Accounts extends Model
{
    use SoftDeletes;

    protected $table = 'accounts';

    protected $primaryKey = '_id';

    protected $connection = 'tenant_mongo';

    protected $fillable = [
        'product_id',
        'sub_product_id',
        'key',
        'data',
        'status',
        'note',
        'customer_id',
        'order_id',
        'import_account_history_id',
        'reserved_at',
        'reserved_by_job',
    ];

    const STATUS = [
        'LIVE' => 'LIVE',
        'SOLD' => 'SOLD',
    ];

    public function scopeFilterProduct($query, $request)
    {
        if (isset($request['product']) && $request['product'] != '') {
            $query->where('key', 'like', '%'.$request['product'].'%')
                ->orWhere('data', 'like', '%'.$request['product'].'%');
        }

        return $query;
    }

    public function scopeFilterStatus($query, $request)
    {
        if (isset($request['status']) && $request['status'] != '') {
            $query->where('status', $request['status']);
        }

        return $query;
    }

    public function scopeFilterCreatedDate($query, $request)
    {
        try {
            if (! empty($request['createdDateStart'])) {
                $start = Carbon::parse($request['createdDateStart'])->startOfDay();
                $query->where('created_at', '>=', $start);
            }

            if (! empty($request['createdDateEnd'])) {
                $end = Carbon::parse($request['createdDateEnd'])->endOfDay();
                $query->where('created_at', '<=', $end);
            }
        } catch (\Exception $e) {
        }

        return $query;
    }

    public function scopeFilterOrderId($query, $request)
    {
        if (isset($request['orderId']) && $request['orderId'] != '') {
            $query->where('order_id', 'like', '%'.$request['orderId'].'%');
        }

        return $query;
    }

    public function scopeFilterSellStatus($query, $request)
    {
        $sellStatus = $request['sellStatus'] ?? 'unsold';
        
        if ($sellStatus == 'sold') {
            $query->whereNotNull('order_id');
        } else {
            $query->whereNull('order_id');
        }

        return $query;
    }
}
