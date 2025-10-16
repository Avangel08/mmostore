<?php

namespace App\Helpers;

use App\Models\Mongo\Customers;
use Illuminate\Contracts\Auth\PasswordBroker;

class Helpers
{
    public static function genIdentifier($length = 5)
    {
        $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        do {
            $randomString = '';
            for ($i = 0; $i < $length; $i++) {
                $randomString .= $characters[random_int(0, strlen($characters) - 1)];
            }
            $exists = Customers::where('identifier', $randomString)->exists();
        } while ($exists);

        return $randomString;
    }

    public static function getPwBrokerStatus($key, $default = "An error occurred, please try again later")
    {
        $rawBrokerStatus = [
            PasswordBroker::RESET_LINK_SENT => "We've sent a password reset link to your email address. Please check your inbox and follow the instructions to reset your password.",
            PasswordBroker::PASSWORD_RESET => "The password has been reset! You can now log in using your new password",
            PasswordBroker::INVALID_USER => "No account found with this email",
            PasswordBroker::INVALID_TOKEN => "The token is invalid or has expired",
            PasswordBroker::RESET_THROTTLED => "The link has been sent. Please check your email",
        ];
        return $rawBrokerStatus[$key] ?? $default;
    }
}
