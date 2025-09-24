<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stores extends Model
{
    use SoftDeletes;
    const STATUS = [
        'ACTIVE' => 1,
        'INACTIVE' => 0,
    ];

    protected $connection = 'mysql';
    protected $table = 'stores';

    protected $fillable = [
        'name',
        'user_id',
        'domain',
        'database_config',
        'server_id',
        'status',
    ];

    protected $casts = [
        'database_config' => 'array',
        'domain' => 'array',
    ];
}


