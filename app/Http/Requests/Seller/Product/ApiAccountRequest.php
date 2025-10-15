<?php

namespace App\Http\Requests\Seller\Product;

use App\Models\Mongo\Accounts;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApiAccountRequest extends FormRequest
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
                'sub_product_id' => ['required', 'string', 'exists:tenant_mongo.sub_products,_id'],
            ],
            default => [],
        };
    }
}
