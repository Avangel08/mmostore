<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class CurrencyRateSeller extends Model
{
    const STATUS = [
        'ACTIVE' => 1,
        'INACTIVE' => 0,
    ];

    protected $connection = 'tenant_mongo';
    protected $table = 'currency_rates';

    protected $fillable = [
        'to_vnd',
        'date',
        'status'
    ];
}
