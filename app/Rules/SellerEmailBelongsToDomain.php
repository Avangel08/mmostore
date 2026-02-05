<?php

namespace App\Rules;

use App\Models\MySQL\Stores;
use App\Models\MySQL\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\Request;

class SellerEmailBelongsToDomain implements ValidationRule
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $currentDomain = $this->request->getHost();
        
        $user = User::where('email', $value)
            ->where('type', User::TYPE['SELLER'])
            ->where('status', User::STATUS['ACTIVE'])
            ->first();

        if (!$user) {
            $fail(__('The email address is not associated with this store'));
            return;
        }

        $storeExists = Stores::where('user_id', $user->id)
            ->where('status', Stores::STATUS['ACTIVE'])
            ->where(function ($query) use ($currentDomain) {
                $query->whereJsonContains('domain', $currentDomain)
                    ->orWhere('domain', 'like', '%"' . $currentDomain . '"%');
            })
            ->exists();

        if (!$storeExists) {
            $fail(__('The email address is not associated with this store'));
        }
    }
}
