<?php

namespace App\Models\Mysql;

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
