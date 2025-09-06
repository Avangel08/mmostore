<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class PaymentTransactions extends Model
{
    const STATUS = [
        'PENDING' => 0,
        'COMPLETE' => 1,
        'REJECT' => 2,
    ];

    protected $connection = 'mysql';
    protected $table = 'payment_transactions';

    protected $fillable = [
        'user_id',
        'check_out_id',
        'payment_method_id',
        'amount',
        'amount_vnd',
        'currency',
        'transaction_id',
        'payment_date',
        'creator_id',
        'charge_id',
        'active_plan_date',
        'note', // kế toán node
        'system_note', // hệ thống cảnh báo khi lỗi
        'status',
    ];
}
