<?php

namespace App\Http\Controllers\Admin\PermissionManagement;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionManagementController extends Controller
{
    public function index()
    {
        return Inertia::render('PermissionManagement/index');
    }

}
