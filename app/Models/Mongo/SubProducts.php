<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;

class SubProducts extends Model
{
    use SoftDeletes;

    protected $table = 'sub_products';

    protected $primaryKey = '_id';

    protected $connection = 'tenant_mongo';

    protected $fillable = [
        'product_id',
        'name',
        'status',
        'price',
        'total_product',
    ];

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    const STATUS = [
        'ACTIVE' => 'ACTIVE',
        'INACTIVE' => 'INACTIVE',
    ];
}
