<?php

namespace App\Http\Requests\Seller\CurrencyRate;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Mongo\CurrencyRateSeller;
use Illuminate\Validation\Rule;
class CurrencyRateRequest extends FormRequest
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
                'to_vnd' => ['required', 'numeric', 'min:1000'],
                'date' => ['required', 'date'],
				'status' => ['required', 'integer', 'in:0,1'],
            ],
            'update' => [
                'id' => ['required'],
                'to_vnd' => ['required', 'numeric', 'min:1000'],
                'date' => ['required', 'date'],
				'status' => ['required', 'integer', 'in:0,1'],
            ],
            default => [],
        };
    }
}
