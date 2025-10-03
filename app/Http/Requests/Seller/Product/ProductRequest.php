<?php

namespace App\Http\Requests\Seller\Product;

use App\Models\Mongo\Products;
use App\Models\MySQL\ProductType;
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
            'categoryId' => ['required', 'string', 'exists:tenant_mongo.categories,_id'],
            'status' => ['required', 'string', Rule::in(array_values(Products::STATUS))],
            'shortDescription' => ['required', 'string', 'max:150'],
            'detailDescription' => ['required', 'string'],
            'productTypeId' => ['required', 'string', 'exists:mysql.product_types,id'],
        ];
        $action = $this->route()->getActionMethod();

        return match ($action) {
            'store' => [
                ...$productRules,
                'image' => ['required', 'file', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max: 2048'],
            ],
            'update' => [
                ...$productRules,
                'image' => ['nullable', 'file', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max: 2048'],
            ],
            default => [],
        };
    }
}
