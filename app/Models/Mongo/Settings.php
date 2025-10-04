<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class Settings extends Model
{
    protected $table = 'settings';

    // protected $connection = 'tenant_mongo';

    protected $fillable = [
        'user_id',
        'theme',
        'store_settings',
    ];
}
