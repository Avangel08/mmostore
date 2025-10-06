<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class Settings extends Model
{
    protected $table = 'settings';

    protected $connection = 'mongodb';

    protected $fillable = [
        'user_id',
        'theme',
        'store_settings',
    ];
}
