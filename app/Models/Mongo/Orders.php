<?php

namespace App\Models\Mongo;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;

class Orders extends Model
{
    use HasFactory, SoftDeletes;

    const STATUS = [
        'PENDING' => 'PENDING',
        'PROCESSING' => 'PROCESSING',
        'COMPLETED' => 'COMPLETED',
        'CANCELLED' => 'CANCELLED',
        'FAILED' => 'FAILED'
    ];

    const PAYMENT_STATUS = [
        'PENDING' => 'PENDING',
        'PAID' => 'PAID',
        'FAILED' => 'FAILED',
        'REFUNDED' => 'REFUNDED'
    ];

    protected $connection = 'tenant_mongo';

    protected $table = 'orders';

    protected $fillable = [
        'customer_id',
        'product_id',
        'sub_product_id',
        'category_id',
        'quantity',
        'unit_price',
        'total_price',
        'order_number',
        'status',
        'payment_status',
        'notes',
    ];

    public function scopeFilterSearch($query, $request)
    {
        if (isset($request['search']) && $request['search'] != '') {
            $search = $request['search'];
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', '%' . $search . '%')
                  ->orWhere('notes', 'like', '%' . $search . '%');
            });
        }

        return $query;
    }

    public function customer()
    {
        return $this->belongsTo(Customers::class, 'customer_id', '_id');
    }

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id', '_id');
    }

    public function subProduct()
    {
        return $this->belongsTo(SubProducts::class, 'sub_product_id', '_id');
    }

    public function category()
    {
        return $this->belongsTo(Categories::class, 'category_id', '_id');
    }
}
