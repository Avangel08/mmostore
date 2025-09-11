<?php

use App\Http\Controllers\Seller\DashBoardController;
use App\Http\Controllers\Seller\LoginController;
use Illuminate\Support\Facades\Route;

// Dynamic admin subdomain routes: {sub}.mmostore.local/admin
Route::domain('{sub}.mmostore.local')
    ->middleware(['route.subdomain', 'tenant.mongo', 'seller'])
    ->group(function () {
        Route::prefix('admin')->group(function () {
            Route::group(['prefix' => 'login'], function () {
                Route::get('/', [LoginController::class, 'login'])->name('seller.login');
                Route::post('/', [LoginController::class, 'authenticate'])->name('seller.login.post');
            });

            Route::group(['prefix' => '/dashboard'], function () {
                Route::get('/', [DashBoardController::class, 'index'])->name('seller.dashboard');
            });
        });
    });



