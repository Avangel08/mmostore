<?php

use App\Http\Controllers\Admin\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Admin\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Admin\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Admin\Auth\NewPasswordController;
use App\Http\Controllers\Admin\Auth\PasswordController;
use App\Http\Controllers\Admin\Auth\PasswordResetLinkController;
use App\Http\Controllers\Admin\Auth\RegisteredUserController;
use App\Http\Controllers\Admin\Auth\VerifyEmailController;
use App\Http\Controllers\Admin\PermissionManagement\PermissionManagementController;
use App\Http\Controllers\Admin\Profile\ProfileController;
use App\Http\Controllers\Admin\RoleManagement\RoleManagementController;
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest:' . config('guard.admin'))->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('admin.register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('admin.login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('admin.password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('admin.password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('admin.password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('admin.password.store');
});


Route::middleware('auth.admin')->group(function () {

    Route::get('/profile-edit', [ProfileController::class, 'edit'])->name('admin.profile.edit');
    Route::patch('/profile-update', [ProfileController::class, 'update'])->name('admin.profile.update');
    Route::delete('/profile-destroy', [ProfileController::class, 'destroy'])->name('admin.profile.destroy');

    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('admin.verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('admin.verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('admin.verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('admin.password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('admin.password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('admin.logout');

    Route::get('/', [RoleManagementController::class, 'index'])->name('admin.index');
    Route::group(['prefix' => '/roles'], function () {
        Route::get('/', [RoleManagementController::class, 'index'])->name('admin.roles.index');
    });
    Route::group(['prefix' => '/permissions'], function () {
        Route::get('/', [PermissionManagementController::class, 'index'])->name('admin.permissions.index');
        Route::post('/add-new-group-permission', [PermissionManagementController::class, 'addNewGroupPermission'])->name('admin.permissions.add');
        Route::put('/update-group-permission/{id}', [PermissionManagementController::class, 'updateGroupPermission'])->name('admin.permissions.update');
    });
});
