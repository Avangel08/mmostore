<?php

namespace App\Http\Requests\Buyer\Product;

use App\Models\MySQL\Stores;
use Illuminate\Foundation\Http\FormRequest;

class CheckoutProductRequest extends FormRequest
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
                'email' => ['required', 'string', 'email', 'unique:users,email'],
                'password' => ['required', 'string'],
                "confirm_password" => ['required', 'string', 'same:password'],
                "store_name" => ['required', 'string', 'min:3', 'max:20'],
                "domain_store" => ['required', 'string', 'min:3', 'max:15', function ($attribute, $value, $fail) {
                    $domainExists = Stores::whereJsonContains('domain', $value . '.' . env('APP_MAIN_DOMAIN'))->exists();
                    if ($domainExists) {
                        $fail(__('Domain already exists'));
                    }
                }],
            ],
            default => [],
        };
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'email.required' => __('Email is required'),
            'email.email' => __('Invalid email'),
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
        ];
    }
}
