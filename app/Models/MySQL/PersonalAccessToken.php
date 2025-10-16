<?php
namespace App\Models\MySQL;
use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    protected $connection = 'mysql';
    protected $table = 'personal_access_tokens';
    protected $fillable = [
        'name',
        'token',
        'abilities',
        'expires_at',
        'token_plain_text',
    ];
}