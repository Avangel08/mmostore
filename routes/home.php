<?php

use App\Http\Controllers\Home\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Home\Auth\ForgotPasswordController;
use App\Http\Controllers\Home\Auth\ResetPasswordController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Home\Register\RegisteredStoreController;
use Illuminate\Support\Facades\Route;

$mainDomain = config('app.main_domain');

Route::domain($mainDomain)->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home.index');
    Route::get('register', [RegisteredStoreController::class, 'register'])->name('home.register');
    Route::post('register', [RegisteredStoreController::class, 'createStore'])->name('home.register.post');
    Route::get('login', [AuthenticatedSessionController::class, 'index'])->name('home.login');
    Route::post('login', [AuthenticatedSessionController::class, 'login'])->name('home.login.post');
    Route::get('go-to-store/{id}', [AuthenticatedSessionController::class, 'goToStore'])->name('home.go-to-store');

    // Forgot Password & Reset Password Routes
    Route::get('forgot-password', [ForgotPasswordController::class, 'create'])->name('home.forgot-password');
    Route::post('forgot-password', [ForgotPasswordController::class, 'store'])->name('home.forgot-password.post');
    Route::get('forgot-password/success', [ForgotPasswordController::class, 'success'])->name('home.forgot-password.success');
    Route::get('reset-password/{token}', [ResetPasswordController::class, 'create'])->name('home.reset-password');
    Route::post('reset-password', [ResetPasswordController::class, 'store'])->name('home.reset-password.post');
    // Post Routes
    Route::get('post/{slug}', [HomeController::class, 'post'])->name('home.post.detail');
});