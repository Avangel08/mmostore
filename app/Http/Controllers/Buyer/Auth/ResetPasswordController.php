<?php

namespace App\Http\Controllers\Buyer\Auth;

use App\Helpers\Helpers;
use App\Http\Controllers\Controller;
use Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Str;

class ResetPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request)
    {
        $email = $request->input('email');
        $token = $request->route('token');
        if (empty($email) || empty($token) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            abort(404);
        }
        return Inertia::render('Auth/ResetPassword', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }


    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $status = Password::broker('customers')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return back()->with('success', __(Helpers::getPwBrokerStatus($status)));
        }

        throw ValidationException::withMessages([
            'email' => __(Helpers::getPwBrokerStatus($status)),
        ]);
    }
}
