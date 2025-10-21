<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class CheckOuts extends Model
{
    const STATUS = [
        'PENDING' => 0,
        'COMPLETE' => 1,
        'REJECT' => 2,
    ];

    const TYPE = [
        'DEFAULT' => 0,
        'NORMAL' => 1,
    ];

    const LIST_TYPE = [
        'DEFAULT' => "Default",
        'NORMAL' => "Normal",
    ];

    protected $connection = 'mysql';
    protected $table = 'check_outs';

    protected $fillable = [
        'user_id',
        'payment_method_id',
        'plan_id',
        'type',
        'name',
        'amount',
        'amount_vnd',
        'interval',
        'interval_type',
        'feature',
        'status',
        'creator_id',
        'content_bank'
    ];

    protected $casts = [
        'feature' => 'array',
    ];
}
