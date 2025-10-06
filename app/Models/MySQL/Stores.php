<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use MongoDB\Laravel\Eloquent\HybridRelations;
use App\Models\Mongo\Settings;

class Stores extends Model
{
    use SoftDeletes;
    use HybridRelations;
    const STATUS = [
        'ACTIVE' => 1,
        'INACTIVE' => 0,
    ];

    protected $connection = 'mysql';
    protected $table = 'stores';

    protected $fillable = [
        'name',
        'user_id',
        'domain',
        'database_config',
        'server_id',
        'status',
        'setting_id'
    ];

    protected $casts = [
        'database_config' => 'array',
        'domain' => 'array',
    ];

    public function setting()
    {
        return $this->hasOne(Settings::class, '_id', 'setting_id');
    }
}


