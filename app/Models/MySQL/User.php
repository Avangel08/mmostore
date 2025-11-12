<?php

namespace App\Models\MySQL;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\NewAccessToken;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Jobs\Mail\JobMailSellerResetPassword;

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

    public function stores()
    {
        return $this->hasMany(Stores::class, 'user_id');
    }

    public function reportAccountSellers()
    {
        return $this->hasManyThrough(
            ReportAccountSeller::class,
            Stores::class,
            'user_id',
            'store_id',
            'id',
            'id'
        );
    }

    public function scopeWithReportAccountSeller($query)
    {
        $latestStatsSubquery = DB::table('report_account_seller as stats')
            ->select('stats.store_id', 'stats.live_count', 'stats.sold_count')
            ->join(
                DB::raw('(SELECT store_id, MAX(recorded_at) AS recorded_at FROM report_account_seller GROUP BY store_id) latest'),
                function ($join) {
                    $join->on('stats.store_id', '=', 'latest.store_id')
                        ->on('stats.recorded_at', '=', 'latest.recorded_at');
                }
            );

        $userStatsSubquery = DB::table('stores')
            ->select(
                'stores.user_id',
                DB::raw('SUM(COALESCE(latest_stats.live_count, 0)) as total_live_count'),
                DB::raw('SUM(COALESCE(latest_stats.sold_count, 0)) as total_sold_count')
            )
            ->leftJoinSub($latestStatsSubquery, 'latest_stats', function ($join) {
                $join->on('latest_stats.store_id', '=', 'stores.id');
            })
            ->groupBy('stores.user_id');

        return $query->leftJoinSub($userStatsSubquery, 'user_stats', function ($join) {
            $join->on('user_stats.user_id', '=', 'users.id');
        })
        ->addSelect([
            DB::raw('COALESCE(user_stats.total_live_count, 0) as live_count'),
            DB::raw('COALESCE(user_stats.total_sold_count, 0) as sold_count'),
        ]);
    }

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

    public function scopeFilterStoreVerifyStatus($query, $request)
    {
        if ($request?->filled('verifyStatus')) {
            $verifyStatus = $request->input('verifyStatus');
            if ($verifyStatus == 'VERIFIED') {
                $query->whereHas('stores', function ($q) {
                    $q->whereNotNull('verified_at');
                });
            } elseif ($verifyStatus == 'UNVERIFIED') {
                $query->whereHas('stores', function ($q) {
                    $q->whereNull('verified_at');
                });
            }
        }
        return $query;
    }
}
