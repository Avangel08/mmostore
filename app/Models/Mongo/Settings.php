<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class Settings extends Model
{
    protected $table = 'settings';

    protected $connection = 'tenant_mongo';

    protected $fillable = [
        'key',
        'value',
        'auto_load',
    ];
}
