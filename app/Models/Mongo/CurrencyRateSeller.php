<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class CurrencyRateSeller extends Model
{
    protected $table = 'currency_rates';

    protected $fillable = [
        'to_vnd',
        'date',
        'status'
    ];
}
