<?php

namespace App\Models\Mongo;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Auth\User as Authenticatable;
use MongoDB\Laravel\Eloquent\SoftDeletes;

class Customers extends Authenticatable
{
    use HasFactory, SoftDeletes;

    protected $connection = 'tenant_mongo';

    protected $table = 'customers';

    const STATUS = [
        'INACTIVE' => 0,
        'ACTIVE' => 1,
        'BLOCK' => 2,
    ];

    protected $fillable = [
        'email',
        'password',
        'email_verified_at',
        'status',
        'image',
        'name',
        'first_name',
        'last_name',
        'phone_number',
        'balance',
        'identifier',
        'deposit_amount',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function scopeFilterSearch($query, $request)
    {
        if (isset($request['search']) && $request['search'] != '') {
            $query->where('name', 'like', '%' . $request['search'] . '%')
                ->orWhere('email', 'like', '%' . $request['search'] . '%');
        }
        return $query;
    }

    public function scopeFilterCreatedDate($query, $request)
    {
        if (isset($request['start_time']) && $request['start_time'] != '' && isset($request['end_time']) && $request['end_time'] != '') {
            $query->whereBetween('created_at', [$request['start_time'], $request['end_time']]);
        }
    }
}

