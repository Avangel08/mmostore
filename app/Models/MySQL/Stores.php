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
        'setting_id',
        'verified_at'
    ];

    protected $casts = [
        'database_config' => 'array',
        'domain' => 'array',
    ];

    public function setting()
    {
        return $this->hasOne(Settings::class, '_id', 'setting_id');
    }

    public function storeCategories()
    {
        return $this->belongsToMany(StoreCategory::class, 'store_category_mapping', 'store_id', 'store_category_id')->withTimestamps();
    }
}


