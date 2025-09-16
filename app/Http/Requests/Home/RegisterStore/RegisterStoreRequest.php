<?php

namespace App\Http\Requests\Home\RegisterStore;

use Illuminate\Foundation\Http\FormRequest;

class RegisterStoreRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $action = $this->route()->getActionMethod();
        return match ($action) {
            'createStore' => [
                'email' => ['required', 'string', 'email'],
                'password' => ['required', 'string'],
                "confirm_password" => ['required', 'string', 'same:password'],
                "store_name" => ['required', 'string', 'min:3', 'max:20'],
            ],
            default => [],
        };
    }
}
