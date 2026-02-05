<?php

namespace App\Http\Requests\Seller\PaymentHistory;

use App\Models\Mongo\PaymentMethodSeller;
use App\Rules\UniquePaymentMethodSellerRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;

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
                'type' => ['required', 'string', 'max:255'],
                'key' => [
                    'required',
                    'string',
                    'max:255',
                    new UniquePaymentMethodSellerRule($this->type)
                ],
                'account_name' => ['required', 'string', 'max:255'],
                'account_number' => ['required', 'string'],
                'user_name' => [Rule::requiredIf($this->type == PaymentMethodSeller::TYPE['BANK']), 'nullable'],
                'password' => [Rule::requiredIf($this->type == PaymentMethodSeller::TYPE['BANK']), 'nullable'],
                'otp' => ['nullable'],
                'api_key' => [Rule::requiredIf($this->type == PaymentMethodSeller::TYPE['SEPAY']), 'nullable'],
            ],
            'update' => [
                'id' => ['required'],
                'type' => ['required', 'string', 'max:255'],
                'key' => [
                    'required',
                    'string',
                    'max:255',
                    new UniquePaymentMethodSellerRule($this->type, $this->id)
                ],
                'account_name' => ['required', 'string', 'max:255'],
                'account_number' => ['required', 'string'],
                'user_name' => [Rule::requiredIf($this->type == PaymentMethodSeller::TYPE['BANK']), 'nullable'],
                'password' => [Rule::requiredIf($this->type == PaymentMethodSeller::TYPE['BANK']), 'nullable'],
                'otp' => ['nullable'],
                'api_key' => [Rule::requiredIf($this->type == PaymentMethodSeller::TYPE['SEPAY']), 'nullable'],
            ],
            'verifyPayment' => [
                'account_name' => ['required', 'string', 'max:255'],
                'account_number' => ['required', 'string'],
                'user_name' => ['required', 'numeric'],
                'password' => ['required', 'string'],
                'otp' => ['nullable', 'numeric']
            ],
            'verifySePay' => [
                'account_name' => ['required', 'string', 'max:255'],
                'account_number' => ['required', 'string'],
                'api_key' => ['required', 'string'],
            ],
            default => [],
        };
    }

    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors()->all();
        return back()->with('error', implode(', ', $errors));
    }
}
