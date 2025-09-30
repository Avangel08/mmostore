<?php

namespace App\Http\Requests\Seller\PaymentHistory;

use App\Models\MySQL\PaymentMethods;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PaymentHistoryRequest extends FormRequest
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
            'store' => [
                'key' => ['required', 'string', 'max:255', Rule::in(array_values(PaymentMethods::KEY))],
                'account_name' => ['required', 'string', 'max:255'],
                'account_number' => ['required', 'string'],
                'user_name' => ['required', 'numeric'],
                'password' => ['required', 'string'],
                'otp' => ['nullable', 'numeric']
            ],
            'verifyPayment' => [
                'account_name' => ['required', 'string', 'max:255'],
                'account_number' => ['required', 'string'],
                'user_name' => ['required', 'numeric'],
                'password' => ['required', 'string'],
                'otp' => ['nullable', 'numeric']
            ],
            default => [],
        };
    }
}
