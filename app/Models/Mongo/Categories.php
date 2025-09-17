<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class Categories extends Model
{
    protected $table = 'categories';

    protected $primaryKey = '_id';

    protected $connection = 'tenant_mongo';

    const STATUS = [
        'INACTIVE' => 0,
        'ACTIVE' => 1,
    ];

    protected $fillable = [
        'name',
        'status'
    ];
}
