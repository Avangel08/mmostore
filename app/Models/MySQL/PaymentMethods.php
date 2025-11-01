<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentMethods extends Model
{
    const KEY = [
        'VCB' => 'VCB',
        'MB' => 'MB',
    ];

    const TYPE = [
        'BANK' => 0,
        'CRYPTO' => 1,
        'SEPAY' => 2,
        'NO_BANK' => 3,
    ];

    const LIST_BANK = [
        'VCB' => 'Vietcombank',
    ];

    const STATUS = [
        'ACTIVE' => 1,
        'INACTIVE' => 0,
    ];

    protected $connection = 'mysql';
    protected $table = 'payment_methods';

    protected $fillable = [
        "type",
        "key", // giống bank_code
        "name",
        "title",
        "description",
        "details", //{account_name, account_number, user_name, password}
        "status",
        "icon",
        "is_verify_otp"  //check xem đã xác thực OTP chưa (true/false)
    ];

    protected $casts = [
        'details' => 'array',
    ];

    public function scopeFilterSearch($query, $request)
    {
        if (isset($request['search']) && $request['search'] != '') {
            $query->where('name', 'like', '%' . $request['search'] . '%');
            $query->orWhere('title', 'like', '%' . $request['search'] . '%');
        }
        return $query;
    }

    public function scopeFilterCreatedDate($query, $request)
    {
        if (isset($request['start_time']) && $request['start_time'] != '') {
            $query->where('created_at', '>=', $request['start_time']);
        }
        if (isset($request['end_time']) && $request['end_time'] != '') {
            $query->where('created_at', '<=', $request['end_time']);
        }
        return $query;
    }

}
