<?php

namespace App\Http\Controllers\Admin\PermissionManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PermissionManagement\PermissionManagementRequest;
use App\Services\Admin\PermissionManagement\PermissionManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionManagementController extends Controller
{
    protected $permissionService;
    public function __construct(PermissionManagementService $permissionService)
    {
        $this->permissionService = $permissionService;
    }
    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        return Inertia::render('PermissionManagement/index', [
            'groupPermissions' => fn() => $this->permissionService->getAllGroupPermissions(isPaginate: true, page: $page, perPage: $perPage, relation: ['roles', 'permissions']),
            'detailPermission' => Inertia::optional(fn() => $this->permissionService->getGroupPermissionById($request->input('id'), relation: ['permissions'])),
            'guards' => array_map(
                fn($key, $item) => ['value' => $item, 'label' => $key],
                array_keys(config('guard', [])),
                config('guard', [])
            ),
        ]);
    }

    public function addNewGroupPermission(PermissionManagementRequest $permissionRequest)
    {
        // if (auth(config('guard.admin'))->user()->cannot('permission_create')) {
        //     return abort(403);
        // }
        try {
            $data = $permissionRequest->validated();
            $this->permissionService->createGroupPermission($data);
            return back()->with('success', "Group permission added successfully");
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $permissionRequest->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);
            return back()->with('error', $e->getMessage());
        }
    }

    public function updateGroupPermission($id, PermissionManagementRequest $permissionRequest)
    {
        // if (auth(config('guard.admin'))->user()->cannot('permission_update')) {
        //     return abort(403);
        // }
        try {
            $data = $permissionRequest->validated();
            $groupPermission = $this->permissionService->getGroupPermissionById($id, relation: ['permissions']);
            if (!$groupPermission) {
                return back()->with('error', "Group permission not found");
            }
            $this->permissionService->updateGroupPermission($groupPermission, $data);
            return back()->with('success', "Group permission updated successfully");
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $permissionRequest->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);
            return back()->with('error', $e->getMessage());
        }
    }
}
