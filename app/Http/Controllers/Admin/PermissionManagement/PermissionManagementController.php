<?php

namespace App\Http\Controllers\Admin\PermissionManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\PermissionManagement\PermissionManagementRequest;
use App\Services\PermissionManagement\PermissionManagementService;
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
}
