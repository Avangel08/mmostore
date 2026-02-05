<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class Servers extends Model
{
    const STATUS = [
        'INACTIVE' => 0,
        'ACTIVE' => 1,
    ];

    protected $connection = 'mysql';
    protected $table = 'servers';

    protected $fillable = [
        'host',
        'port',
        'user',
        'password',
        'status',
    ];
}
