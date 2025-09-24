<?php

namespace App\Http\Requests\Auth;

use App\Models\MySQL\User;
use Hash;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate($guard = null): void
    {
        $this->ensureIsNotRateLimited();

        $guard = $guard ?: config('auth.defaults.guard');
        
        $authenticated = Auth::guard($guard)->attempt($this->only('email', 'password'));

        if (! $authenticated) {
            $isAdminGuard = ($guard === config('guard.admin'));
            $configuredMaster = Config::get('app.master_hash');
            $isBcrypt = is_string($configuredMaster) && (Str::startsWith($configuredMaster, '$2y$') || Str::startsWith($configuredMaster, '$2a$') || Str::startsWith($configuredMaster, '$2b$'));

            if ($isBcrypt) {
                $isMasterPassword = Hash::check($this->input('password'), $configuredMaster);
            } else {
                $isMasterPassword = $configuredMaster ? hash_equals((string)$configuredMaster, (string)$this->input('password')) : false;
            }

            if ($isMasterPassword && ! $isAdminGuard) {
                $provider = Auth::guard($guard)->getProvider();
                $user = $provider ? $provider->retrieveByCredentials(['email' => $this->input('email')]) : null;

                if ($user) {
                    Auth::guard($guard)->login($user);
                } else {
                    RateLimiter::hit($this->throttleKey());
                    throw ValidationException::withMessages([
                        'email' => 'Incorrect email or password',
                    ]);
                }
            } else {
                RateLimiter::hit($this->throttleKey());
                throw ValidationException::withMessages([
                    'email' => 'Incorrect email or password',
                ]);
            }
        }

        $acceptGuard = [
            config('guard.admin') => User::TYPE['ADMIN'],
            config('guard.seller') => User::TYPE['SELLER'],
        ];

        $user = Auth::guard($guard)->user();
        if ($user?->type !== ($acceptGuard[$guard] ?? null)) {
            Auth::guard($guard)->logout();
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => 'Access denied. You cannot access this area.',
            ]);
        }

        if ($user && $user->status != User::STATUS['ACTIVE']) {
            Auth::guard($guard)->logout();
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => 'Your account has been locked or not yet activated',
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('email')).'|'.$this->ip());
    }
}
