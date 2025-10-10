<?php

namespace App\Models\Mongo;

use Carbon\Carbon;
use MongoDB\Laravel\Eloquent\Model;

class Categories extends Model
{
    protected $table = 'categories';

    protected $primaryKey = '_id';

    protected $connection = 'tenant_mongo';

    const STATUS = [
        'INACTIVE' => 'INACTIVE',
        'ACTIVE' => 'ACTIVE',
    ];

    protected $fillable = [
        'name',
        'status',
    ];

    public function products()
    {
        return $this->hasMany(Products::class, 'category_id', 'id');
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
