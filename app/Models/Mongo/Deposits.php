<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class Deposits extends Model
{

    const STATUS = [
        'PENDING' => 0,
        'COMPLETE' => 1,
        'ERROR' => 2,
    ];
    protected $table = 'deposits';

    protected $fillable = [
        'customer_id',
        'email',
        'payment_method_id',
        'amount',
        'amount_vnd',
        'currency',
        'transaction_id',
        'payment_date',
        'note',
        'system_note',
        'status',
        'content_bank',
    ];
}
