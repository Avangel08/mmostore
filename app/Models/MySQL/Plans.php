<?php

namespace App\Models\MySQL;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Plans extends Model
{
    use SoftDeletes;
    const STATUS = [
        'ACTIVE' => 1,
        'INACTIVE' => 0,
    ];

    const LIST_STATUS = [
        'ACTIVE' => "Active",
        'INACTIVE' => "Inactive",
    ];

    const TYPE = [
        'DEFAULT' => 0,
        'NORMAL' => 1,
    ];

    const LIST_TYPE = [
        'DEFAULT' => "Default",
        'NORMAL' => "Normal",
    ];

    const SHOW_PUBLIC = [
        'false' => 0,
        'true' => 1,
    ];

    const BEST_CHOICE = [
        'false' => 0,
        'true' => 1,
    ];

    protected $connection = 'mysql';
    protected $table = 'plans';

    protected $fillable = [
        'type',
        'name',
        'price', // vnd
        'price_origin', // vnd
        'off',
        'interval',
        'interval_type',
        'feature',
        'description',
        'status',
        'creator_id',
        'best_choice',
        'show_public',
        'sub_description'
    ];

    protected $casts = [
        'feature' => 'array',
    ];

    public function scopeFilterName($query, $request)
    {
        if (isset($request['name']) && $request['name'] != '') {
            $query->where('name', 'like', '%' . $request['name'] . '%');
        }

        return $query;
    }

    public function scopeFilterType($query, $request)
    {
        if (isset($request['type']) && $request['type'] != '') {
            $query->where('type', (int) $request['type']);
        }

        return $query;
    }

    public function scopeFilterStatus($query, $request)
    {
        if (isset($request['status']) && $request['status'] != '') {
            $query->where('status', (int) $request['status']);
        }

        return $query;
    }

    public function scopeFilterShowPublic($query, $request)
    {
        if (isset($request['showPublic']) && $request['showPublic'] != '') {
            $query->where('show_public', (int) $request['showPublic']);
        }

        return $query;
    }

    public function scopeFilterPriceRange($query, $request)
    {
        if (isset($request['priceMin']) && $request['priceMin'] != '') {
            $query->where('price', '>=', (float) $request['priceMin']);
        }

        if (isset($request['priceMax']) && $request['priceMax'] != '') {
            $query->where('price', '<=', (float) $request['priceMax']);
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
