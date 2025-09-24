<?php

namespace App\Http\Requests\Seller\Product;

use App\Models\Mongo\SubProducts;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SubProductRequest extends FormRequest
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
                'subProductName' => ['required', 'string', 'max:50'],
                'price' => ['required', 'numeric', 'min:1'],
                'productId' => ['required', 'string', 'exists:tenant_mongo.products,_id'],
            ],
            'update' => [
                'subProductName' => ['required', 'string', 'max:50'],
                'price' => ['required', 'numeric', 'min:1'],
                'status' => ['required', Rule::in(array_values(SubProducts::STATUS))],
                'productId' => ['required', 'string', 'exists:tenant_mongo.products,_id'],
            ],
            default => [],
        };
    }
}
