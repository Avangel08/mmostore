<?php

namespace App\Http\Controllers\Admin\RoleManagement;

use App\Http\Controllers\Controller;
use App\Services\RoleManagement\RoleManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleManagementController extends Controller
{
    protected $roleService;

    public function __construct(RoleManagementService $roleService)
    {
        $this->roleService = $roleService;
    }

    public function index(Request $request)
    {
        $page = $request->input('page', 1);
        $perPage = $request->input('perPage', 10);
        return Inertia::render('RoleManagement/index', [
            'roles' => fn() => $this->roleService->getAllRoles(isPaginate: true, page: $page, perPage: $perPage),
        ]);
    }
}
