<?php

namespace App\Models\Mongo;

use MongoDB\Laravel\Eloquent\Model;
use Laravel\Sanctum\NewAccessToken;
use Illuminate\Support\Str;

class PersonalAccessToken extends Model
{
    protected $connection = 'tenant_mongo';
    protected $table = 'personal_access_tokens';

    protected $fillable = [
        'tokenable_id',
        'tokenable_type',
        'name',
        'token',
        'abilities',
        'last_used_at',
        'expires_at',
        'token_plain_text', // Store plain text token for display
    ];

    protected $casts = [
        'abilities' => 'array',
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    protected $hidden = [
        'token',
    ];

    /**
     * Get the tokenable model that the access token belongs to.
     */
    public function tokenable()
    {
        return $this->morphTo('tokenable');
    }

    /**
     * Find the token instance given the plain-text token.
     */
    public static function findToken($token)
    {
        if (strpos($token, '|') === false) {
            return static::where('token_plain_text', $token)->first();
        }

        [$id, $token] = explode('|', $token, 2);

        if ($instance = static::find($id)) {
            return hash_equals($instance->token_plain_text, $token) ? $instance : null;
        }
    }

    /**
     * Determine if the token has a given ability.
     */
    public function can($ability)
    {
        return in_array('*', $this->abilities) ||
               in_array($ability, $this->abilities);
    }

    /**
     * Determine if the token is missing a given ability.
     */
    public function cant($ability)
    {
        return !$this->can($ability);
    }

    /**
     * Get the key for the model.
     */
    public function getKeyName()
    {
        return '_id';
    }

    /**
     * Get the value of the model's primary key.
     */
    public function getKey()
    {
        return $this->getAttribute($this->getKeyName());
    }
}
