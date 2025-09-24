<?php

namespace App\Models\Mongo;

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
        'is_non_duplicate', // san pham khong trung: true/false
    ];

    const STATUS = [
        'ACTIVE' => 'ACTIVE',
        'INACTIVE' => 'INACTIVE',
    ];

    public function categories()
    {
        return $this->belongsTo(Categories::class, 'category_id');
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
