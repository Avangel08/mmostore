<?php

namespace App\Http\Requests\Seller\Product;

use App\Models\Mongo\Accounts;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
        $inputMethod = $this->input('input_method', 'file');
        
        $baseRules = [
            'input_method' => ['required', 'string', Rule::in(array_values(Accounts::INPUT_METHOD))],
            'product_id' => ['required', 'string', 'exists:tenant_mongo.products,_id'],
            'sub_product_id' => ['required', 'string', 'exists:tenant_mongo.sub_products,_id'],
        ];

        if ($inputMethod === Accounts::INPUT_METHOD['FILE']) {
            $baseRules['file'] = ['required', 'file', 'mimes:txt', 'max:50000'];
        } elseif ($inputMethod === Accounts::INPUT_METHOD['TEXTAREA']) {
            $baseRules['content'] = ['required', 'string', 'min:1', 'max:10000'];
        }

        $action = $this->route()->getActionMethod();

        return match ($action) {
            'store' => $baseRules,
            default => [],
        };
    }

    public function messages(): array
    {
        return [
            // Input method validation messages
            'input_method.required' => 'Input method is required.',
            'input_method.string' => 'Input method must be a string.',
            'input_method.in' => 'Input method must be either file or textarea.',
            
            // Product validation messages
            'product_id.required' => 'Product ID is required.',
            'product_id.string' => 'Product ID must be a string.',
            'product_id.exists' => 'The selected product is invalid.',
            
            // Sub product validation messages
            'sub_product_id.required' => 'Sub product ID is required.',
            'sub_product_id.string' => 'Sub product ID must be a string.',
            'sub_product_id.exists' => 'The selected sub product is invalid.',
            
            // File validation messages
            'file.required' => 'Please select a file to upload.',
            'file.file' => 'The uploaded item must be a file.',
            'file.mimes' => 'Only .txt files are allowed.',
            'file.max' => 'The file must not be greater than 50MB.',
            
            // Content validation messages
            'content.required' => 'Please enter content.',
            'content.string' => 'Content must be a string.',
            'content.min' => 'Content must have at least 1 character.',
            'content.max' => 'Content must not exceed 10000 characters.',
        ];
    }
}
