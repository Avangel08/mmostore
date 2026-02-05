<?php

namespace App\Models\Mongo;

use App\Models\MySQL\ProductType;
use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Eloquent\SoftDeletes;

class Products extends Model
{
    use SoftDeletes;

    protected $table = 'products';

    protected $primaryKey = '_id';

    protected $connection = 'tenant_mongo';

    protected $fillable = [
        'category_id',
        'name',
        'status',
        'detail_description',
        'short_description',
        'image',
        'slug',
        'product_type_id',
    ];

    const STATUS = [
        'ACTIVE' => 'ACTIVE',
        'INACTIVE' => 'INACTIVE',
    ];

    public function category()
    {
        return $this->belongsTo(Categories::class, 'category_id');
    }

    public function subProducts()
    {
        return $this->hasMany(SubProducts::class, 'product_id', 'id');
    }

    public function productType()
    {
        return $this->belongsTo(ProductType::class, 'product_type_id');
    }

    public function scopeFilterName($query, $request)
    {
        if (isset($request['name']) && $request['name'] != '') {
            $query->where('name', 'like', '%'.$request['name'].'%');
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

    public function scopeFilterCategory($query, $request)
    {
        if (isset($request['category']) && $request['category'] != '') {
            $query->where('category_id', $request['category']);
        }

        return $query;
    }

    public function scopeFilterCreatedDate($query, $request)
    {
        try {
            if (! empty($request['createdDateStart'])) {
                $start = Carbon::parse($request['createdDateStart'])->startOfDay();
                $query->where('created_at', '>=', $start);
            }

            if (! empty($request['createdDateEnd'])) {
                $end = Carbon::parse($request['createdDateEnd'])->endOfDay();
                $query->where('created_at', '<=', $end);
            }
        } catch (\Exception $e) {
        }

        return $query;
    }
}
