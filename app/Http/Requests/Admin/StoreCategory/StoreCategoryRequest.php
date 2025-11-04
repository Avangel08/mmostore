<?php

namespace App\Http\Requests\Admin\StoreCategory;
use App\Models\MySQL\StoreCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
                'store_category_name' => ['required', 'string', 'max:150', Rule::unique('mysql.store_categories', 'name')],
                'store_category_status' => ['required', 'string', Rule::in(array_values(StoreCategory::STATUS))],
                'description' => ['nullable', 'string'],
            ],
            'update' => [
                'store_category_name' => ['required', 'string', 'max:150', Rule::unique('mysql.store_categories', 'name')->ignore($this->route('store_category'))],
                'store_category_status' => ['required', 'string', Rule::in(array_values(StoreCategory::STATUS))],
                'description' => ['nullable', 'string'],
            ],
            default => [],
        };
    }
}
