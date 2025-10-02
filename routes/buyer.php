<?php

use App\Http\Controllers\Buyer\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Buyer\Auth\RegisteredUserController;
use App\Http\Controllers\Buyer\BuyerController;
use App\Http\Controllers\Buyer\Deposit\DepositController;
use App\Http\Controllers\Buyer\Product\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['route.subdomain', 'validate.subdomain', 'tenant.mongo'])
    ->group(function () {
        // Public routes (no authentication required)
        Route::get('/', [BuyerController::class, 'home'])->name('buyer.home');
        // Route::get('/products', [BuyerController::class, 'products'])->name('buyer.products');
        // Route::get('/product/{id}', [BuyerController::class, 'productDetail'])->name('buyer.product.detail');
        // Route::get('/about', [BuyerController::class, 'about'])->name('buyer.about');
        // Route::get('/contact', [BuyerController::class, 'contact'])->name('buyer.contact');
        
        // Login/Register routes (public but with session)
        Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('buyer.login');
        
        Route::get('/register', [RegisteredUserController::class, 'create'])->name('buyer.register');
        Route::post('/register', [RegisteredUserController::class, 'store']);
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('buyer.logout');

        Route::group(['prefix' => '/products'], function () {
            Route::get('/', [ProductController::class, 'show'])->name('buyer-product.show');
            Route::get('/detail/{id}', [ProductController::class, 'detail'])->name('buyer-product.detail');
        });

        // Protected routes (authentication required)
        Route::middleware('unified.auth')->group(function () {
            // Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('buyer.logout');
            // Route::get('/profile', [BuyerProfileController::class, 'index'])->name('buyer.profile');
            // Route::get('/orders', [BuyerOrderController::class, 'index'])->name('buyer.orders');
            // Route::get('/cart', [BuyerCartController::class, 'index'])->name('buyer.cart');
            // Route::get('/checkout', [BuyerCheckoutController::class, 'index'])->name('buyer.checkout');
        });

        Route::group(['prefix' => 'deposits'], function () {
            Route::get('/', [DepositController::class, 'index'])->name('buyer.deposits');
            Route::post('/checkout', [DepositController::class, 'checkout'])->name('buyer.deposit.checkout');
            Route::get('/ping', [DepositController::class, 'pingDeposit'])->name('buyer.deposit.ping');
        });

    });



