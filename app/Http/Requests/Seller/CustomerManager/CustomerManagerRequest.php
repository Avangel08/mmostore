<?php

namespace App\Http\Requests\Seller\CustomerManager;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerManagerRequest extends FormRequest
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
            'deposit' => [
                'payment_method_id' => 'required|integer',
                'transaction_type' => 'required|integer|in:1,3',
                'currency' => 'required|string|in:VND,USD',
                'amount' => 'required|numeric|min:1',
                'transaction_code' => 'required|string',
                'note' => 'nullable|string|max:500',
                'customer_id' => 'required|string',
            ],

            default => [],
        };
    }
}
