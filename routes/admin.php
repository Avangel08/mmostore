<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\RoleManagement\RoleManagementController;
use Illuminate\Support\Facades\Route;

// Routes for primary domain mmostore.local (no middleware)
Route::middleware(['auth:'.config('guard.admin'), 'role:'.config('role.admin')])
    ->group(function () {
        Route::get('/', [RoleManagementController::class, 'index'])->name('admin.index');
    });



