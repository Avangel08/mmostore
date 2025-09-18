<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class BalanceHistories extends Model
{
    const TYPE = [
        "deposit" => 1, //user nạp tiền - deposit
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
}
