<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class Charges extends Model
{
    const TYPE = [
        'DEFAULT' => 0,
        'NORMAL' => 1,
    ];

    const LIST_TYPE = [
        'DEFAULT' => "Default",
        'NORMAL' => "Normal",
    ];

    protected $connection = 'mysql';
    protected $table = 'charges';

    protected $fillable = [
        'user_id',
        'type',
        'name',
        'interval',
        'interval_type',
        'feature',
        'active_on',
        'expires_on',
        'check_out_id',
        'creator_id'
    ];

    protected $casts = [
        'feature' => 'array',
    ];
}
