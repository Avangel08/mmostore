<?php

namespace App\Models\MySQL;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\NewAccessToken;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use HasRoles;
    use Notifiable;
    use SoftDeletes;

    const STATUS = [
        'INACTIVE' => 0,
        'ACTIVE' => 1,
        'BLOCK' => 2,
    ];

    const TYPE = [
        'ADMIN' => 'ADMIN',
        'SELLER' => 'SELLER',
    ];

    protected $connection = 'mysql';

    protected $table = 'users';

    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'status',
        'password',
        'email_verified_at',
        'type',
        'image',
        'country',
        'phone',
        'phone_code',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Override createToken from HasApiTokens trait
    public function createToken(string $name, array $abilities = ['*'], ?DateTimeInterface $expiresAt = null)
    {
        $plainTextToken = $this->generateTokenString();

        $personalAccessToken = $this->tokens()->create([
            'name' => $name,
            'token' => hash('sha256', $plainTextToken),
            'abilities' => $abilities,
            'expires_at' => $expiresAt,
        ]);

        $newAccessToken = new NewAccessToken($personalAccessToken, $personalAccessToken->getKey() . '|' . $plainTextToken);

        $personalAccessToken->update([
            'token_plain_text' => $newAccessToken->plainTextToken,
        ]);

        return $newAccessToken;
    }

    // Filter scopes
    public function scopeFilterName($query, $request)
    {
        if ($request && $request->filled('name')) {
            return $query->where('name', 'like', '%' . $request->input('name') . '%');
        }
        return $query;
    }

    public function scopeFilterEmail($query, $request)
    {
        if ($request && $request->filled('email')) {
            return $query->where('email', 'like', '%' . $request->input('email') . '%');
        }
        return $query;
    }

    public function scopeFilterType($query, $request)
    {
        if ($request && $request->filled('type')) {
            return $query->where('type', $request->input('type'));
        }
        return $query;
    }

    public function scopeFilterStatus($query, $request)
    {
        if ($request && $request->filled('status')) {
            $statusValue = null;
            switch ($request->input('status')) {
                case 'ACTIVE':
                    $statusValue = self::STATUS['ACTIVE'];
                    break;
                case 'INACTIVE':
                    $statusValue = self::STATUS['INACTIVE'];
                    break;
                case 'BLOCK':
                    $statusValue = self::STATUS['BLOCK'];
                    break;
            }
            if ($statusValue !== null) {
                return $query->where('status', $statusValue);
            }
        }
        return $query;
    }

    public function scopeFilterCreatedDate($query, $request)
    {
        if ($request) {
            if ($request->filled('createdDateStart')) {
                $query->whereDate('created_at', '>=', $request->input('createdDateStart'));
            }
            if ($request->filled('createdDateEnd')) {
                $query->whereDate('created_at', '<=', $request->input('createdDateEnd'));
            }
        }
        return $query;
    }
}
