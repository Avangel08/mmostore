<?php

namespace App\Models\MySQL;

use Illuminate\Database\Eloquent\Model;

class PasswordResetToken extends Model
{
    protected $connection = 'mysql';
    protected $table = 'password_reset_tokens';

    // The table only has created_at; no updated_at column
    public $timestamps = false;

    protected $primaryKey = 'email';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'email',
        'token',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}


