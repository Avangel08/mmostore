<?php

namespace App\Models\MySQL;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class StoreCategory extends Model
{
    protected $connection = 'mysql';
    protected $table = 'store_categories';
    protected $fillable = [
        'name',
        'description',
        'status'
    ];
    const STATUS = [
        'ACTIVE' => 'ACTIVE',
        'INACTIVE' => 'INACTIVE',
    ];

    public function stores()
    {
        return $this->belongsToMany(Stores::class, 'store_category_mapping', 'store_category_id', 'store_id')->withTimestamps();
    }

    public function scopeFilterName($query, $request)
    {
        if (isset($request['name']) && $request['name'] != '') {
            $query->where('name', 'like', '%' . $request['name'] . '%');
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
            if (!empty($request['createdDateStart'])) {
                $start = Carbon::parse($request['createdDateStart'])->startOfDay();
                $query->where('created_at', '>=', $start);
            }

            if (!empty($request['createdDateEnd'])) {
                $end = Carbon::parse($request['createdDateEnd'])->endOfDay();
                $query->where('created_at', '<=', $end);
            }
        } catch (\Exception $e) {
        }

        return $query;
    }
}
