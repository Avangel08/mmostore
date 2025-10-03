<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class ProductType extends Model
{
    protected $connection = 'mysql';
    protected $table = 'product_types';
    protected $fillable = [
        'name',
        'description',
        'status'
    ];
    const STATUS = [
        'ACTIVE' => 'ACTIVE',
        'INACTIVE' => 'INACTIVE',
    ];
}
