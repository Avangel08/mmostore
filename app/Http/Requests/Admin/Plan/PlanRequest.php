<?php

namespace App\Http\Requests\Admin\Plan;

use App\Models\MySQL\Plans;
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
        $planId = $this->route('plan');

        $rules = [
            'type' => ['required', 'integer', Rule::in(array_values(Plans::TYPE))],
            'price' => ['required', 'decimal:0,2', 'min:0', 'max:999999999'],
            'priceOrigin' => ['required', 'decimal:0,2', 'min:0', 'max:999999999'],
            'sale' => ['nullable', 'integer', 'min:0', 'max:100'],
            'intervalDay' => ['required', 'integer', 'min:0', 'max:999999999'],
            'intervalMonth' => ['required', 'integer', 'min:0', 'max:999999999'],
            'status' => ['required', 'integer', Rule::in(array_values(Plans::STATUS))],
            'bestChoice' => ['required', 'boolean'],
            'showPublic' => ['required', 'boolean'],
            'shortDescription' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
        ];

        return match ($action) {
            'store' => [
                ...$rules,
                'planName' => ['required', 'string', 'max:255', Rule::unique('plans', 'name')],
            ],
            'update' => [
                ...$rules,
                'planName' => ['required', 'string', 'max:255', Rule::unique('plans', 'name')->ignore($planId)],
            ],
            default => [],
        };
    }
}
