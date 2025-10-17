<?php

namespace App\Http\Requests\Home\RegisterStore;

use App\Models\MySQL\Stores;
use App\Models\MySQL\User;
use Illuminate\Foundation\Http\FormRequest;

class RegisterStoreRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $action = $this->route()->getActionMethod();

        return match ($action) {
            'createStore' => [
                'email' => ['required', 'string', 'email', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', 'unique:users,email'],
                'password' => ['required', 'string'],
                "confirm_password" => ['required', 'string', 'same:password'],
                "store_name" => ['required', 'string', 'min:3', 'max:20'],
                "domain_store" => ['required', 'string', 'min:3', 'max:15', function ($attribute, $value, $fail) {
                    $domainExists = Stores::whereJsonContains('domain', $value . '.' . env('APP_MAIN_DOMAIN'))->exists();
                    if ($domainExists) {
                        $fail(__('Domain already exists'));
                    }
                }],
                'phone' => ['required', 'string', 'min:8', 'max:15', 'regex:/^[0-9\s\-\+\(\)]+$/',function ($attribute, $value, $fail) {
                    $phoneExists = User::where('phone', $value)
                        ->where('country', request()->input('country'))
                        ->exists();

                    if ($phoneExists) {
                        $fail(__('Phone number already exists'));
                    }
                }],
                'country_code' => ['required', 'string', 'regex:/^\+\d{1,4}$/'],
                'country' => ['required', 'string', 'size:2', 'regex:/^[A-Z]{2}$/'],
            ],
            default => [],
        };
    }

    public function messages(): array
    {
        return [
            'email.required' => __('Email is required'),
            'email.email' => __('Invalid email'),
            'email.regex' => __('Invalid email'),
            'email.unique' => __('Email already exists'),
            'password.required' => __('Password is required'),
            'confirm_password.required' => __('Confirm password is required'),
            'confirm_password.same' => __('Passwords must match'),
            'store_name.required' => __('Store name is required'),
            'store_name.min' => __('Store name must be at least 3 characters'),
            'store_name.max' => __('Store name must be at most 20 characters'),
            'domain_store.required' => __('Domain store is required'),
            'domain_store.min' => __('Domain store must be at least 3 characters'),
            'domain_store.max' => __('Domain store must be at most 15 characters'),
            'phone.required' => __('Phone is required'),
            'phone.min' => __('Phone must be at least 8 characters'),
            'phone.max' => __('Phone must be at most 15 characters'),
            'phone.regex' => __('Phone contains invalid characters'),
            'country_code.required' => __('Country code is required'),
            'country_code.regex' => __('Invalid country code format'),
            'country.required' => __('Country is required'),
            'country.size' => __('Country must be exactly 2 characters'),
            'country.regex' => __('Country must be valid ISO country code (e.g., VN, US, GB)'),
        ];
    }
}
