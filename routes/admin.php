<?php

use App\Http\Controllers\Admin\Dashboard\DashboardController;
use App\Http\Controllers\Admin\PermissionManagement\PermissionManagementController;
use App\Http\Controllers\Admin\Plan\PlanController;
use App\Http\Controllers\Admin\RoleManagement\RoleManagementController;
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\UserManager\UserController;
use Illuminate\Support\Facades\Route;

Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('admin.login');
Route::post('login', [AuthenticatedSessionController::class, 'store']);

Route::middleware(['checkauth:admin', 'admin.user.type'])->group(function () {

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('admin.logout');

    Route::get('/', [DashboardController::class, 'index'])->name('admin.dashboard');

    Route::group(['prefix' => '/roles'], function () {
        Route::get('/', [RoleManagementController::class, 'index'])->name('admin.roles.index');
        Route::post('/add-roles', [RoleManagementController::class, 'addNewRole'])->name('admin.roles.add');
        Route::put('/update-role/{id}', [RoleManagementController::class, 'updateRole'])->name('admin.roles.update');
    });

    Route::group(['prefix' => '/permissions'], function () {
        Route::get('/', [PermissionManagementController::class, 'index'])->name('admin.permissions.index');
        Route::post('/add-new-group-permission', [PermissionManagementController::class, 'addNewGroupPermission'])->name('admin.permissions.add');
        Route::put('/update-group-permission/{id}', [PermissionManagementController::class, 'updateGroupPermission'])->name('admin.permissions.update');
    });

    Route::group(['prefix' => '/user'], function () {
        Route::get('/', [UserController::class, 'index'])->name('admin.user.index');
        Route::post('/add', [UserController::class, 'add'])->name('admin.user.add');
        Route::put('/update/{id}', [UserController::class, 'update'])->name('admin.user.update');
        Route::delete('/delete', [UserController::class, 'delete'])->name('admin.user.delete');
        Route::get('/{id}/login-as', [UserController::class, 'loginAs'])->name('admin.user.login-as');
    });

    Route::group(['prefix' => 'plans'], function () {
        Route::post('/duplicate-plan/{id}', [PlanController::class, 'duplicatePlan'])->name('admin.plans.duplicate-plan');
    });
    Route::resource('plans', PlanController::class, ['as' => 'admin']);
});
