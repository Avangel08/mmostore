<?php

namespace App\Providers;

use App\Models\Mongo\CustomerAccessToken;
use App\Models\Mongo\Customers;
use Illuminate\Auth\RequestGuard;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    public function boot(): void
    {
        Auth::extend('token_buyer', function ($app, $name, array $config) {
            $userResolver = function (Request $request) {
                $token = static::extractBearerToken($request) ?: $request->header('X-Api-Token') ?: $request->query('token');
                if (!$token) {
                    return null;
                }

                $hashed = hash('sha256', $token);
                $customerToken = CustomerAccessToken::where('token', $hashed)->first();
                if (!$customerToken) {
                    return null;
                }

                if ($customerToken->expires_at && now()->greaterThan($customerToken->expires_at)) {
                    return null;
                }

                if ($customerToken->tokenable_type !== Customers::class) {
                    return null;
                }

                $customer = Customers::where('_id', $customerToken->tokenable_id)->first();
                if (!$customer) {
                    return null;
                }

                try {
                    $customerToken->update(['last_used_at' => now()]);
                } catch (\Throwable $e) {
                }

                return $customer;
            };

            return new RequestGuard($userResolver, $app['request'], Auth::createUserProvider($config['provider'] ?? null));
        });
    }

    private static function extractBearerToken(Request $request): ?string
    {
        $authHeader = $request->header('Authorization');
        if (!$authHeader) {
            return null;
        }
        if (str_starts_with($authHeader, 'Bearer ')) {
            return substr($authHeader, 7);
        }
        return null;
    }
}
