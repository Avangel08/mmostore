<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class Posts extends Model
{
    const STATUS = [
        'DRAFT' => 0,
        'PUBLISHED' => 1
    ];

    const LIST_STATUS = [
        'Draft' => 'DRAFT',
        'Published' => 'PUBLISHED'
    ];

    const VISIBILITY = [
        'PUBLIC' => 0,
        'PRIVATE' => 1
    ];

    const LIST_VISIBILITY = [
        'Public' => 'PUBLIC',
        'Private' => 'PRIVATE'
    ];

    const CATEGORY = [
        'News' => 0,
    ];

    protected $connection = 'mysql';

    protected $table = 'posts';

    protected $fillable = [
        'title',
        'user_id',
        'content',
        'short_description',
        'thumbnail',
        'status',
        'visibility',
        'slug'
    ];
}
