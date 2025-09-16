<?php

namespace App\Http\Controllers\Admin\RoleManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RoleManagement\RoleManagementRequest;
use App\Services\PermissionManagement\PermissionManagementService;
use App\Services\RoleManagement\RoleManagementService;
use Artisan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleManagementController extends Controller
{
    protected $roleService;
    protected $permissionService;

    public function __construct(RoleManagementService $roleService, PermissionManagementService $permissionService)
    {
        $this->roleService = $roleService;
        $this->permissionService = $permissionService;
    }

    public function index(Request $request)
    {
        // if (auth(config('guard.admin'))->user()->cannot('permission_view')) {
        //     return abort(403);
        // }
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        return Inertia::render('RoleManagement/index', [
            'roles' => fn() => $this->roleService->getAllRoles(isPaginate: true, page: $page, perPage: $perPage, relation: ['groupPermissions']),
            'guards' => fn() => array_map(
                fn($key, $item) => ['value' => $item, 'label' => $key],
                array_keys(config('guard', [])),
                config('guard', [])
            ),
            'allGroupPermissions' => fn() => $this->permissionService->getAllGroupWithPermissions(),
            'detailRole' => fn() => $this->roleService->getById(id: $request->input('id'), relation: ['groupPermissions.permissions'])
        ]);
    }

    public function addNewRole(RoleManagementRequest $roleRequest)
    {
        // if (auth(config('guard.admin'))->user()->cannot('permission_create')) {
        //     return abort(403);
        // }
        try {
            $data = $roleRequest->validated();
            $this->roleService->createRole($data);
            return back()->with('success', "Group permission added successfully");
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $roleRequest->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);
            return back()->with('error', $e->getMessage());
        }
    }

    public function updateRole($id, RoleManagementRequest $roleRequest)
    {
        // if (auth(config('guard.admin'))->user()->cannot('permission_update')) {
        //     return abort(403);
        // }
        try {
            $data = $roleRequest->validated();
            $role = $this->roleService->getById($id, relation: ['permissions']);
            if (!$role) {
                return back()->with('error', "Role not found");
            }
            $this->roleService->updateRole($role, $data);
            return back()->with('success', "Role updated successfully");
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $roleRequest->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);
            return back()->with('error', $e->getMessage());
        }
    }
}
