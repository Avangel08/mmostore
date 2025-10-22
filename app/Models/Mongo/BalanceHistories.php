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

    public function scopeFilterDateAt($query, $request){
        if(isset($request['start_time']) && $request['start_time'] != ''){
            $start_time = Carbon::createFromFormat('Y-m-d', $request['start_time'])->startOfDay()->toDateTimeString();
            $query->where('date_at', '>=', $start_time);
        }

        if(isset($request['end_time']) && $request['end_time'] != ''){
            $end_time = Carbon::createFromFormat('Y-m-d', $request['end_time'])->endOfDay()->toDateTimeString();
            $query->where('date_at', '<=', $end_time);
        }
        return $query;
    }   
}
