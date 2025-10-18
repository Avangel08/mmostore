<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class Banks extends Model
{
    const STATUS = [
        'ACTIVE' => 1,
        'INACTIVE' => 0,
    ];
    protected $connection = 'mysql';
    protected $table = 'banks';

    protected $fillable = [
        'name',
        'code',
        'bin',
        'short_name',
        'supported',
        'status'
    ];
}
