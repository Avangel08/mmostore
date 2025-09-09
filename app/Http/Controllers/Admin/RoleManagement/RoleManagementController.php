<?php

namespace App\Http\Controllers\Admin\RoleManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/RoleManagement/index');
    }
}
