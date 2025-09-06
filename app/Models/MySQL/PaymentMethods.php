<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class PaymentMethods extends Model
{
    const TYPE = [
        'BANK' => 1,
        'CRYPTO' => 2,
    ];

    const STATUS = [
        'ACTIVE' => 1,
        'INACTIVE' => 0,
    ];

    protected $connection = 'mysql';
    protected $table = 'payment_methods';

    protected $fillable = [
        "type",
        "key",
        "name",
        "details",
        "status",
        "icon"
    ];

    protected $casts = [
        'details' => 'array',
    ];
}
