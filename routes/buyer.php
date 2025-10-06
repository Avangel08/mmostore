<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Buyer\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Buyer\Auth\RegisteredUserController;
use App\Http\Controllers\Buyer\BuyerController;
use App\Http\Controllers\Buyer\Deposit\DepositController;
use App\Http\Controllers\Buyer\Product\ProductController;
use App\Http\Controllers\Buyer\Order\OrderController;

Route::middleware(['route.subdomain', 'validate.subdomain', 'tenant.mongo'])
    ->group(function () {
        // Public routes (no authentication required)
        Route::get('/', [BuyerController::class, 'home'])->name('buyer.home');
        
        // Login/Register routes (public but with session)
        Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('buyer.login');
        
        Route::get('/register', [RegisteredUserController::class, 'create'])->name('buyer.register');
        Route::post('/register', [RegisteredUserController::class, 'store']);
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('buyer.logout');

        Route::group(['prefix' => '/products'], function () {
            Route::get('/', [ProductController::class, 'show'])->name('buyer-product.show');
            Route::get('/detail/{id}', [ProductController::class, 'detail'])->name('buyer-product.detail');
            Route::post('/checkout', [ProductController::class, 'checkout'])->name('buyer-product.checkout');
        });

        Route::group(['prefix' => 'deposits'], function () {
            Route::get('/', [DepositController::class, 'index'])->name('buyer.deposits');
            Route::post('/checkout', [DepositController::class, 'checkout'])->name('buyer.deposit.checkout');
            Route::get('/ping', [DepositController::class, 'pingDeposit'])->name('buyer.deposit.ping');
        });

        // Protected routes (requires buyer login)
        Route::middleware('auth:buyer')->group(function () {
            Route::get('/orders', [OrderController::class, 'index'])->name('buyer.orders');
        });
    });



