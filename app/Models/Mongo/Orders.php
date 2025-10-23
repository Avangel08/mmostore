<?php

namespace App\Models\Mongo;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Carbon;
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

    public function scopeFilterStatus($query, $request)
    {
        if (isset($request['status']) && $request['status'] != '') {
            $query->where('status', $request['status']);
        }

        return $query;
    }

    public function scopeFilterPaymentStatus($query, $request)
    {
        if (isset($request['payment_status']) && $request['payment_status'] != '') {
            $query->where('payment_status', $request['payment_status']);
        }

        return $query;
    }

    public function scopeFilterCategory($query, $request)
    {
        if (isset($request['category_id']) && $request['category_id'] != '') {
            $query->where('category_id', $request['category_id']);
        }

        return $query;
    }

    public function scopeFilterProduct($query, $request)
    {
        if (isset($request['product_id']) && $request['product_id'] != '') {
            $query->where('product_id', $request['product_id']);
        }

        return $query;
    }

    public function scopeFilterCustomer($query, $request)
    {
        if (isset($request['customer_id']) && $request['customer_id'] != '') {
            $query->where('customer_id', $request['customer_id']);
        }

        return $query;
    }

    public function scopeFilterDate($query, $request)
    {
        if(isset($request['date_from']) && $request['date_from']){
            $start_time = Carbon::parse($request['date_from'])->startOfDay();
            $query->where('created_at', '>=', $start_time);
        }

        if (isset($request['date_to']) && $request['date_to']){
            $end_time = Carbon::parse($request['date_to'])->endOfDay();
            $query->where('created_at', '<=', $end_time);
        }

        return $query;
    }
}
