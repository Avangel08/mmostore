<?php

namespace App\Http\Requests\PermissionManagement;

use Illuminate\Foundation\Http\FormRequest;

class PermissionManagementRequest extends FormRequest
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
            'addNewGroupPermission' => [
                'groupPermissionName' => ['required', 'string', 'max:50'],
                'groupPermissionDescription' => ['nullable', 'string', 'max:1000'],
                'groupPermissionKey' => ['required', 'string', 'max:50', 'unique:group_permissions,key'],
                'groupPermissionValue' => ['required', 'array', 'min:1'],
                'groupPermissionValue.*' => ['required', 'string', 'max:50'],
            ],
            default => [],
        };
    }
}
