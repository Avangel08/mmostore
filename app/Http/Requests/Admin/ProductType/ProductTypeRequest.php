<?php

namespace App\Http\Requests\Admin\ProductType;
use App\Models\MySQL\ProductType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductTypeRequest extends FormRequest
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
                'productTypeName' => ['required', 'string', 'max:150', Rule::unique('mysql.product_types', 'name')],
                'productTypeStatus' => ['required', 'string', Rule::in(array_values(ProductType::STATUS))],
                'description' => ['nullable', 'string'],
            ],
            'update' => [
                'productTypeName' => ['required', 'string', 'max:150', Rule::unique('mysql.product_types', 'name')->ignore($this->route('product_type'))],
                'productTypeStatus' => ['required', 'string', Rule::in(array_values(ProductType::STATUS))],
                'description' => ['nullable', 'string'],
            ],
            default => [],
        };
    }
}
