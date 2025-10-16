<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;

class CustomerAccessToken extends Model
{
    protected $connection = 'tenant_mongo';
    protected $table = 'customer_access_tokens';

    protected $fillable = [
        'tokenable_id',
        'tokenable_type',
        'name',
        'token',
        'abilities',
        'expires_at',
        'token_plain_text',
    ];

    protected $casts = [
        'abilities' => 'array',
        'expires_at' => 'datetime',
    ];

    protected $hidden = [
        'token',
    ];

    public function getKeyName()
    {
        return '_id';
    }

    public function getKey()
    {
        return $this->getAttribute($this->getKeyName());
    }

    public function can($ability)
    {
        return in_array('*', $this->abilities) ||
               in_array($ability, $this->abilities);
    }
}
