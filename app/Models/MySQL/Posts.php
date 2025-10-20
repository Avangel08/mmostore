<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class Posts extends Model
{
    const STATUS = [
        'DRAFT' => 0,
    ];

    protected $connection = 'mysql';

    protected $table = 'posts';

    protected $fillable = [
        'title',
        'content',
        'image',
        'status'
    ];
}
