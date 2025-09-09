<?php

namespace App\Http\Controllers\Admin\RoleManagement;

use App\Http\Controllers\Controller;
use App\Service\RoleManagement\RoleManagementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleManagementController extends Controller
{
    protected $roleService;

    public function __construct(RoleManagementService $roleService) {
        $this->roleService = $roleService;
    }

    public function index()
    {
        $roles = function() {
            return $this->roleService->getAllRoles(isPaginate: false);
        };

        return Inertia::render('Admin/RoleManagement/index', [
            'roles' => $roles,
        ]);
    }
}
