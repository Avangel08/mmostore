<?php

namespace App\Http\Requests\Admin\RoleManagement;

use Illuminate\Foundation\Http\FormRequest;

class RoleManagementRequest extends FormRequest
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
            'addNewRole' => [
                "roleName" => ['required', 'string', 'max:50', 'unique:roles,name'],
                "guard" => ['required', 'string', 'in:'.implode(',', array_values(config('guard', [])))],
                "permissions" => ['nullable', 'array'],
                "permissionIds.*" => ['nullable', 'numeric', 'exists:permissions,id'],
            ],
            'updateRole' => [
                "roleName" => ['required', 'string', 'max:50', 'unique:roles,name,'.$this->route('id')],
                "guard" => ['required', 'string', 'in:'.implode(',', array_values(config('guard', [])))],
                "permissionIds" => ['nullable', 'array'],
                "permissionIds.*" => ['nullable', 'numeric', 'exists:permissions,id'],
            ],
            default => [],
        };
    }
}
