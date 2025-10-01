<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentMethods extends Model
{
    use SoftDeletes;

    const USER_TYPE = [
        'ADMIN' => 0,
        'SELLER' => 1,
    ];
    
    const KEY = [
        'VCB' => 'VCB',
        'MB' => 'MB',
    ];
    const TYPE = [
        'BANK' => 0,
        'CRYPTO' => 1,
    ];

    const LIST_BANK = [
        'VCB' => 'Vietcombank',
        // 'MB' => 'MB Bank',
    ];

    const STATUS = [
        'ACTIVE' => 1,
        'INACTIVE' => 0,
    ];

    protected $connection = 'mysql';
    protected $table = 'payment_methods';

    protected $fillable = [
        "user_id", 
        "user_type",
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
