<?php

namespace App\Http\Requests\Admin\CurrencyRate;

use App\Models\MySQL\CurrencyRates;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class CurrencyRateAdminRequest extends FormRequest
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
                'to_vnd' => ['required', 'decimal:0,2', 'min:1000', 'max:999999999.99'],
                'date' => ['required', 'date', Rule::unique('mysql.currency_rates')],
                'status' => ['required', 'string', Rule::in(array_values(CurrencyRates::STATUS))],
            ],
            'update' => [
                'id' => ['required'],
                'to_vnd' => ['required', 'decimal:0,2', 'min:1000', 'max:999999999.99'],
                'date' => ['required', 'date', Rule::unique('mysql.currency_rates')->ignore($this->route('currency_rate'))],
                'status' => ['required', 'string', Rule::in(array_values(array: CurrencyRates::STATUS))],
            ],
            default => [],
        };
    }
}
