<?php

namespace App\Http\Requests\Seller\Product;

use App\Models\Mongo\Products;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
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
        $productRules = [
            'productName' => ['required', 'string', 'max:255'],
            'categoryId' => ['required', 'exists:tenant_mongo.categories,_id'],
            'status' => ['required', Rule::in(array_values(Products::STATUS))],
            'isNonDuplicate' => ['required', 'boolean'],
            'shortDescription' => ['required', 'string', 'max:150'],
            'detailDescription' => ['required', 'string'],
        ];
        $action = $this->route()->getActionMethod();

        return match ($action) {
            'index' => [
                'productName' => ['nullable', 'string', 'max:255'],
                'category' => ['nullable', 'exists:tenant_mongo.categories,_id'],
                'createdDateStart' => ['nullable', 'string'],
                'createdDateEnd' => ['nullable', 'string'],
                'status' => ['nullable', Rule::in(array_values(Products::STATUS))],
            ],
            'createProduct' => [
                ...$productRules,
                'image' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max: 2048'],
            ],
            'updateProduct' => [
                ...$productRules,
                'image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max: 2048'],
            ],
            default => [],
        };
    }
}
