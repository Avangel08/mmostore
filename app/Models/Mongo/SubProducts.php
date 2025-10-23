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
        'quantity',
    ];

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id');
    }

    const STATUS = [
        'ACTIVE' => 'ACTIVE',
        'INACTIVE' => 'INACTIVE',
    ];

    public function scopeFilterSubProductId($query, $request)
    {
        if (isset($request['subId']) && $request['subId'] != '') {
            $query->where('_id', $request['subId']);
        }

        return $query;
    }
}
