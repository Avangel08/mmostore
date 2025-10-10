<?php

namespace App\Models\Mongo;

use App\Models\MySQL\PaymentMethods;
use MongoDB\Laravel\Eloquent\Model;

class BalanceHistories extends Model
{
    const TYPE = [
        "deposit" => 1, //user nạp tiền - deposit
        "purchase" => 2, //user mua hàng - purchase
        "deduct_money" => 3, //user trừ tiền - deduct_money
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
        "sale_channel_id" //Thông t
    ];

    public function customer()
    {
        return $this->belongsTo(Customers::class, 'customer_id');
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethods::class, 'payment_method_id');
    }

    public function scopeFilterSearch($query, $request){
        if(isset($request['search']) && $request['search'] != ''){
            $query->whereHas('customer', function($q) use ($request){
                $q->where('name', 'like', '%'.$request['search'].'%');
            })->orWhere('transaction', 'like', '%'.$request['search'].'%');
        }

        return $query;
    }

    public function scopeFilterCreatedDate($query, $request){
        if(isset($request['start_time']) && $request['start_time'] != ''){
            $query->where('created_at', '>=', $request['start_time']);
        }

        if(isset($request['end_time']) && $request['end_time'] != ''){
            $query->where('created_at', '<=', $request['end_time']);
        }
        return $query;
    }
}
