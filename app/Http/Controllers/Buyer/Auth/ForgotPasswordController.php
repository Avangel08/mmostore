<?php

namespace App\Http\Controllers\Buyer\Auth;

use App\Helpers\Helpers;
use App\Http\Controllers\Controller;
use App\Models\Mongo\Customers;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::broker('customers')->sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return back()->with('status', __(Helpers::getPwBrokerStatus($status)));
        }

        throw ValidationException::withMessages([
            'email' => __(Helpers::getPwBrokerStatus($status)),
        ]);
    }
}
