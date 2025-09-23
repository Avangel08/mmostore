<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;

class Accounts extends Model
{
    use SoftDeletes;
    protected $table = 'accounts';

    protected $primaryKey = '_id';

    protected $connection = 'tenant_mongo';

    protected $fillable = [
        'product_id',
        'sub_product_id',
        'key',
        'data',
        'status',
        'note',
        'customer_id',
        'order_id',
    ];

    const STATUS = [
        'LIVE' => 'LIVE',
    ];
}
