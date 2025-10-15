<?php

namespace App\Http\Controllers\Seller\Auth;

use App\Http\Controllers\Controller;
// No DB checks needed; rely on broker at submit time
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ResetPasswordController extends Controller
{
    public function __construct()
    {
    }

    public function create(Request $request)
    {
        $plainToken = $request->route('token');

        if (empty($plainToken)) {
            abort(404, 'Invalid reset link');
        }
        
        $email = $request->query('email');

        return Inertia::render('Auth/ResetPassword', [
            'email' => $email,
            'token' => $plainToken,
            'tokenExpired' => false,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $plainToken = $request->input('token');
        $email = $request->input('email');
        $originalToken = $plainToken;

        $status = Password::broker('users')->reset(
            [
                'email' => $email,
                'password' => $request->password,
                'password_confirmation' => $request->password_confirmation,
                'token' => $originalToken,
            ],
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return back()->with('success', __($status));
        }

        throw ValidationException::withMessages([
            'email' => __($status),
        ]);
    }
}
