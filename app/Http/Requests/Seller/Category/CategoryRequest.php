<?php

namespace App\Http\Requests\Seller\Category;

use App\Models\Mongo\Categories;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
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
                'categoryName' => ['required', 'string', 'max:150', Rule::unique('tenant_mongo.categories', 'name')],
                'categoryStatus' => ['required', 'string', Rule::in(array_values(Categories::STATUS))],
            ],
            'update' => [
                'categoryName' => ['required', 'string', 'max:150', Rule::unique('tenant_mongo.categories', 'name')->ignore($this->route('category'))],
                'categoryStatus' => ['required', 'string', Rule::in(array_values(Categories::STATUS))],
            ],
            default => [],
        };
    }
}
