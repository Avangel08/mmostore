<?php

use App\Http\Controllers\Seller\DashBoardController;
use App\Http\Controllers\Seller\LoginController;
use Illuminate\Support\Facades\Route;

Route::domain('{sub}.mmostore.local')
    ->middleware(['route.subdomain', 'validate.subdomain', 'tenant.mongo', 'unified.session', 'unified.subdomain'])
    ->group(function () {
        // Public routes (no auth middleware needed)
        Route::group(['prefix' => 'login'], function () {
            Route::get('/', [LoginController::class, 'login'])->name('seller.login');
            Route::post('/', [LoginController::class, 'authenticate'])->name('seller.login.post');
        });

        // Protected routes (need auth middleware)
        Route::middleware('unified.auth')->group(function () {
            Route::post('logout', [LoginController::class, 'destroy'])->name('seller.logout');

            Route::group(['prefix' => 'dashboard'], function () {
                Route::get('/', [DashBoardController::class, 'index'])->name('seller.dashboard');
            });
        });
    });



