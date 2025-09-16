<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class Stores extends Model
{
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


