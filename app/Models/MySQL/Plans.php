<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class Plans extends Model
{
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
        'price',
        'price_origin',
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
}
