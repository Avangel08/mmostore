<?php

namespace App\Http\Requests\Seller\Product;

use Illuminate\Foundation\Http\FormRequest;

class AccountRequest extends FormRequest
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
                'file' => ['required', 'file', 'mimes:txt', 'max:100000'],
                'mimetypes' => ['text/plain'],
                'product_id' => ['required', 'string', "exists:tenant_mongo.products,_id"],
                'sub_product_id' => ['required', 'string', "exists:tenant_mongo.sub_products,_id"],
            ],
            default => [],
        };
    }
}
