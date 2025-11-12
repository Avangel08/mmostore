<?php

namespace App\Models\Mongo;

use Illuminate\Support\Carbon;
use MongoDB\Laravel\Eloquent\Model;

class BalanceHistories extends Model
{
    const TYPE = [
        "deposit" => 1, //user nạp tiền - deposit
        "purchase" => 2, //user mua hàng - purchase
        "deduct_money" => 3, //user trừ tiền - deduct_money
    ];

    const GATEWAY = [
      'SYSTEM' => "SYSTEM",
      'API' => "API",
    ];

    protected $table = 'balance_histories';

    protected $fillable = [
        "customer_id",
        "payment_method_id",
        "type",
        "amount",
        "amount_vnd", // nếu nạp tiền bằng bank thì sẽ lưu thêm trường này
        "before",
        "after",
        "transaction",
        "description",
        "date_at",
        "sale_channel_id", //Thông t
        "gate_way" //Thông t
    ];

    public function customer()
    {
        return $this->belongsTo(Customers::class, 'customer_id');
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethodSeller::class, 'payment_method_id');
    }

    public function scopeFilterSearch($query, $request){
        if(isset($request['search']) && $request['search'] != ''){
            $query->whereHas('customer', function($q) use ($request){
                $q->where('name', 'like', '%'.$request['search'].'%');
            })->orWhere('transaction', 'like', '%'.$request['search'].'%');
        }

        return $query;
    }
    
    public function scopeFilterTransactionId($query, $request){
        if(isset($request['transaction_id']) && $request['transaction_id'] != ''){
            $query->where('transaction', 'like', '%'.$request['transaction_id'].'%');
        }
        return $query;
    }

    public function scopeFilterCustomerName($query, $request){
        if(isset($request['customer_name']) && $request['customer_name'] != ''){
            $query->whereHas('customer', function($q) use ($request){
                $q->where('name', 'like', '%'.$request['customer_name'].'%');
            });
        }
        return $query;
    }

    public function scopeFilterType($query, $request){
        if(isset($request['type']) && $request['type'] != ''){
            $query->where('type', (int)$request['type']);
        }
        return $query;
    }

    public function scopeFilterDateAt($query, $request)
    {
        $and = [];

        if (!empty($request['start_time'])) {
            $start = Carbon::createFromFormat('Y-m-d', $request['start_time'])->startOfDay();
            $and[] = [
                '$or' => [
                    ['date_at' => ['$gte' => new \MongoDB\BSON\UTCDateTime($start->getTimestamp() * 1000)]],
                    ['date_at' => ['$gte' => $start->format('Y-m-d H:i:s')]],
                ],
            ];
        }

        if (!empty($request['end_time'])) {
            $end = Carbon::createFromFormat('Y-m-d', $request['end_time'])->endOfDay();
            $and[] = [
                '$or' => [
                    ['date_at' => ['$lte' => new \MongoDB\BSON\UTCDateTime($end->getTimestamp() * 1000)]],
                    ['date_at' => ['$lte' => $end->format('Y-m-d H:i:s')]],
                ],
            ];
        }

        if ($and) {
            $query->whereRaw(['$and' => $and]);
        }

        return $query;
    }
}
