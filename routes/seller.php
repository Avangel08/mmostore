<?php

use App\Http\Controllers\Seller\SellerController;
use Illuminate\Support\Facades\Route;

// Dynamic admin subdomain routes: {sub}.mmostore.local/admin
Route::domain('{sub}.mmostore.local')
    ->middleware(['web', 'tenant.mongo', 'subdomain.admin'])
    ->group(function () {
        Route::prefix('admin')->group(function () {
            Route::get('/', [SellerController::class, 'home'])->name('seller.home');
            Route::get('/login', [SellerController::class, 'login'])->name('seller.login');
            Route::get('/dashboard', [SellerController::class, 'dashboard'])->name('seller.dashboard');
        });
    });



