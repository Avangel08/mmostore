<?php

use App\Http\Controllers\Admin\Dashboard\DashboardController;
use App\Http\Controllers\Admin\PermissionManagement\PermissionManagementController;
use App\Http\Controllers\Admin\RoleManagement\RoleManagementController;
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest:' . config('guard.admin'), 'unified.session'])->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('admin.login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});


Route::middleware(['unified.auth', 'unified.session'])->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('admin.logout');

    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    Route::group(['prefix' => '/roles'], function () {
        Route::get('/', [RoleManagementController::class, 'index'])->name('admin.roles.index');
    });

    Route::group(['prefix' => '/permissions'], function () {
        Route::get('/', [PermissionManagementController::class, 'index'])->name('admin.permissions.index');
        Route::post('/add-new-group-permission', [PermissionManagementController::class, 'addNewGroupPermission'])->name('admin.permissions.add');
        Route::put('/update-group-permission/{id}', [PermissionManagementController::class, 'updateGroupPermission'])->name('admin.permissions.update');
    });
});
