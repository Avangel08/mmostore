<?php

namespace App\Http\Requests\Seller\Plan;

use App\Models\MySQL\PaymentMethods;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PlanRequest extends FormRequest
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
            'checkout' => [
                'plan_id' => ['required', 'integer', 'exists:mysql.plans,id'],
                'payment_method_id' => ['required', 'integer', 'exists:mysql.payment_methods,id'],
            ],
            default => [],
        };
    }
}
