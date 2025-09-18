<?php

namespace App\Http\Requests\Seller\SellerProfile;

use Illuminate\Foundation\Http\FormRequest;

class SellerProfileRequest extends FormRequest
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
            'updateInfo' => [
                'first_name' => ['required', 'string', 'min:2', 'max:50'],
                'last_name' => ['required', 'string', 'min:2', 'max:50'],
            ],
            'changePassword' => [
                'current_password' => ['required', 'current_password:'.config('guard.seller')],
                'password' => ['required', 'string', 'min:8', 'confirmed'], 
            ],
            default => [],
        };
    }
}
