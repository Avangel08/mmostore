<?php

use App\Http\Controllers\Buyer\BuyerController;
use Illuminate\Support\Facades\Route;

Route::domain('{sub}.mmostore.local')
    ->middleware(['route.subdomain', 'validate.subdomain', 'tenant.mongo', 'unified.session', 'unified.subdomain'])
    ->group(function () {
        // Public routes (no authentication required)
        Route::get('/', [BuyerController::class, 'home'])->name('buyer.home');
        Route::get('/products', [BuyerController::class, 'products'])->name('buyer.products');
        Route::get('/product/{id}', [BuyerController::class, 'productDetail'])->name('buyer.product.detail');
        Route::get('/about', [BuyerController::class, 'about'])->name('buyer.about');
        Route::get('/contact', [BuyerController::class, 'contact'])->name('buyer.contact');
        
        // Login/Register routes (public but with session)
        Route::get('/login', [BuyerLoginController::class, 'show'])->name('buyer.login');
        Route::post('/login', [BuyerLoginController::class, 'authenticate'])->name('buyer.login.post');
        Route::get('/register', [BuyerRegisterController::class, 'show'])->name('buyer.register');
        Route::post('/register', [BuyerRegisterController::class, 'store'])->name('buyer.register.post');
        
        // Protected routes (authentication required)
        Route::middleware('unified.auth')->group(function () {
            Route::get('/profile', [BuyerProfileController::class, 'index'])->name('buyer.profile');
            Route::get('/orders', [BuyerOrderController::class, 'index'])->name('buyer.orders');
            Route::get('/cart', [BuyerCartController::class, 'index'])->name('buyer.cart');
            Route::get('/checkout', [BuyerCheckoutController::class, 'index'])->name('buyer.checkout');
            Route::post('/logout', [BuyerLoginController::class, 'destroy'])->name('buyer.logout');
        });
    });



