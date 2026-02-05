<?php

namespace App\Models\Mongo;

use App\Jobs\Mail\JobSendMail;
use App\Jobs\Mail\MailType;
use Auth;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\HasApiTokens;
use MongoDB\Laravel\Auth\User as Authenticatable;
use MongoDB\Laravel\Eloquent\SoftDeletes;

class Customers extends Authenticatable
{
    use HasFactory, SoftDeletes, Notifiable, HasApiTokens;

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
        'remember_token',
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

    public function sendPasswordResetNotification($token)
    {
        $dataSendMail = [
            'email' => $this->email,
            'first_name' => $this->first_name,
            'url' => route('buyer.password.reset', ['token' => $token, 'email' => $this->email]),
        ];
        dispatch(new JobSendMail(MailType::BUYER_RESET_PASSWORD, $dataSendMail, app()->getLocale()));
    }

    public function tokens()
    {
        return $this->morphMany(CustomerAccessToken::class, 'tokenable');
    }

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
        if(isset($request['start_time']) && $request['start_time']){
            $start_time = Carbon::parse($request['start_time'])->startOfDay();
            $query->where('created_at', '>=', $start_time);
        }
        if (isset($request['end_time']) && $request['end_time']){
            $end_time = Carbon::parse($request['end_time'])->endOfDay();
            $query->where('created_at', '<=', $end_time);
        }
        return $query;
    }
}

