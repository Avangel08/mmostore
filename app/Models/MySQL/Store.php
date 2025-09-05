<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $table = 'stores';

    protected $fillable = [
        'name',
        'subdomain',
        'database_config',
    ];

    protected $casts = [
        'database_config' => 'array',
    ];
}


