<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CurrencyRates extends Model
{
    use SoftDeletes;
    protected $connection = 'mysql';
    protected $table = 'currency_rates';

    protected $fillable = [
        'to_vnd',
        'date'
    ];
}
