<?php

use App\Http\Controllers\Seller\DashBoardController;
use App\Http\Controllers\Seller\LoginController;
use Illuminate\Support\Facades\Route;

// Dynamic admin subdomain routes: {sub}.mmostore.local/admin
Route::domain('{sub}.mmostore.local')
    ->middleware(['web', 'tenant.mongo', 'subdomain.admin'])
    ->group(function () {
        Route::prefix('admin')->group(function () {
            Route::get('/', [DashBoardController::class, 'home'])->name('seller.home');
            Route::get('/login', [LoginController::class, 'login'])->name('seller.login');
            Route::post('/login', [LoginController::class, 'authenticate'])->name('seller.login.post');
        });
    });



