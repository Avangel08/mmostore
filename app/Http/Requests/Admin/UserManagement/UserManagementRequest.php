<?php

namespace App\Http\Requests\Admin\UserManagement;

use App\Models\MySQL\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserManagementRequest extends FormRequest
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
        $statuses = array_values(User::STATUS);
        $types = array_values(User::TYPE);

        $commonRules = [
            "name" => ['required', 'string', 'max:50'],
            "email" => ['required', 'string', 'email', 'max:50'],
            "status" => ['required', Rule::in($statuses)],
            "type" => ['required', Rule::in($types)],
        ];

        return match ($action) {
            'add' => array_merge($commonRules, [
                "email" => ['required', 'string', 'email', 'max:50', 'unique:users,email'],
                "password" => ['required', 'string', 'min:8', 'max:20'],
            ]),
            'update' => array_merge($commonRules, [
                "email" => ['required', 'string', 'email', 'max:50', Rule::unique('users', 'email')->ignore($this->route('id'))],
                "password" => ['sometimes', 'string', 'min:8', 'max:20'],
            ]),
            'delete' => [
                'ids' => ['required', 'array', 'min:1'],
                'ids.*' => ['integer', Rule::exists('users', 'id')],
            ],
            'adminAddPlanSeller' => [
                'userId' => ['required', 'integer'],
                'planId' => ['required', 'integer'],
                'paymentMethodId' => ['required', 'integer'],
                'datetimeExpired' => [
                    'required',
                    'date_format:Y-m-d H:i',
                    'after:' . now()->format('Y-m-d H:i'),
                ],
                'amount' => ['required', 'decimal:0,2', 'min:0', 'max:999999999'],
                'note' => ['nullable', 'string', 'max:10000'],
            ],
            default => [],
        };
    }
}
