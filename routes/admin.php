<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\RoleManagement\RoleManagementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:'.config('guard.admin')])
    ->group(function () {
        Route::get('/', [RoleManagementController::class, 'index'])->name('admin.index');
        Route::get('/roles', [RoleManagementController::class, 'index'])->name('admin.roles');
        Route::get('/permissions', [RoleManagementController::class, 'index'])->name('admin.permissions');
    });
