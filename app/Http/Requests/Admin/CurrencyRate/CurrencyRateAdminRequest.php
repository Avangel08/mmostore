<?php

namespace App\Http\Requests\Admin\CurrencyRate;

use Illuminate\Foundation\Http\FormRequest;
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
                'date' => ['required', 'date'],
                'status' => ['required', 'string'],
            ],
            'update' => [
                'id' => ['required'],
                'to_vnd' => ['required', 'decimal:0,2', 'min:1000', 'max:999999999.99'],
                'date' => ['required', 'date'],
                'status' => ['required', 'string'],
            ],
            default => [],
        };
    }
}
