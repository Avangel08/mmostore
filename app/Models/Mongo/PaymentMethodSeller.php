<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class PaymentMethodSeller extends Model
{
    const KEY = [
        'VCB' => 'VCB',
        'MB' => 'MB',
    ];
    const TYPE = [
        'BANK' => 0,
        'CRYPTO' => 1,
        'THIRD_PARTY' => 2,
    ];

    const LIST_BANK = [
        'VCB' => 'Vietcombank',
        // 'MB' => 'MB Bank',
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
        "details", //{account_name, password, account_number}
        "status",
        "icon",
        "is_verify_otp"  //check xem đã xác thực OTP chưa (true/false)
    ];

    protected $casts = [
        'details' => 'array',
    ];
}
