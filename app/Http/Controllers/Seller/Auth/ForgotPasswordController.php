<?php

namespace App\Http\Controllers\Seller\Auth;

use App\Helpers\Helpers;
use App\Http\Controllers\Controller;
use App\Jobs\Mail\JobSendMail;
use App\Jobs\Mail\MailType;
use App\Rules\SellerEmailBelongsToDomain;
use App\Models\MySQL\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Support\Facades\Password;

class ForgotPasswordController extends Controller
{
    public function __construct()
    {
    }

    public function create()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    public function success()
    {
        return Inertia::render('Auth/ForgotPasswordSuccess');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email', new SellerEmailBelongsToDomain($request)],
        ]);

        $email = $request->input('email');
        $user = User::where('email', $email)->where('type', User::TYPE['SELLER'])->first();
        
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => [trans(Helpers::getPwBrokerStatus(Password::INVALID_USER))],
            ]);
        }

        $token = Password::broker('users')->createToken($user);
        
        $dataSendMail = [
            'email' => $email,
            'name' => $user->name,
            'url' => route('seller.reset-password', ['token' => $token]) . '?email=' . urlencode($email),
        ];

        dispatch(new JobSendMail(MailType::SELLER_RESET_PASSWORD, $dataSendMail, app()->getLocale()));

        return back()->with('status', trans(Helpers::getPwBrokerStatus(Password::RESET_LINK_SENT)));
    }
}
