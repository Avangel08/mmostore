<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class PaymentMethodSeller extends Model
{
    const KEY = [
        'VCB' => 'VCB',
        'MB' => 'MB',
        'BALANCE' => 'BALANCE',
        'API' => 'API',
    ];
    const TYPE = [
        'BANK' => 0,
        'CRYPTO' => 1,
        'SEPAY' => 2,
        'BALANCE' => 3,
        'API' => 4,
    ];

    const LIST_BANK = [
        'VCB' => 'Vietcombank',
        'MB' => 'MB Bank',   
    ];

    const STATUS = [
        'ACTIVE' => 1,
        'INACTIVE' => 0,
    ];

    protected $table = 'payment_methods';

    protected $fillable = [
        "type",
        "key", // giống bank_code
        "name",
        "description",
        "details", //{account_name, password, account_number}
        "status",
        "icon",
        "is_verify_otp"  //check xem đã xác thực OTP chưa (true/false)
    ];
}
