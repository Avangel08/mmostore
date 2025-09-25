<?php

use App\Http\Controllers\Seller\Category\CategoryController;
use App\Http\Controllers\Seller\DashBoardController;
use App\Http\Controllers\Seller\LoginController;
use App\Http\Controllers\Seller\PaymentHistory\PaymentHistoryController;
use App\Http\Controllers\Seller\Product\ProductController;
use App\Http\Controllers\Seller\Product\SellerAccountController;
use App\Http\Controllers\Seller\Product\SubProductController;
use App\Http\Controllers\Seller\Profile\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['route.subdomain', 'validate.subdomain', 'tenant.mongo'])
    ->group(function () {
        Route::prefix('admin')->group(function () {
            // Public routes (no auth middleware needed)
            Route::group(['prefix' => 'login'], function () {
                Route::get('/', [LoginController::class, 'login'])->name('seller.login');
                Route::post('/', [LoginController::class, 'authenticate'])->name('seller.login.post');
            });

            // Protected routes (need auth middleware)
            Route::middleware('checkauth:seller')->group(function () {
                Route::post('logout', [LoginController::class, 'destroy'])->name('seller.logout');

                Route::get('/', function () {
                    return redirect()->route('seller.dashboard');
                })->name('seller.home');

                Route::group(['prefix' => 'dashboard'], function () {
                    Route::get('/', [DashBoardController::class, 'index'])->name('seller.dashboard');
                });

                Route::group(['prefix' => 'profile'], function () {
                    Route::get('/', [ProfileController::class, 'index'])->name('seller.profile');
                    Route::put('/update-info', [ProfileController::class, 'updateInfo'])->name('seller.profile.update-info');
                    Route::put('/change-password', [ProfileController::class, 'changePassword'])->name('seller.profile.change-password');
                });

                // seller category
                Route::group(['prefix' => 'category'], function () {
                    Route::delete('/delete-multiple', [CategoryController::class, 'deleteMultipleCategories'])->name('seller.category.delete-multiple');
                });
                Route::resource('category', CategoryController::class, ['as' => 'seller']);

                // seller product
                Route::group(['prefix' => 'product'], function () {
                    Route::delete('/delete-multiple', [ProductController::class, 'deleteMultipleProduct'])->name('seller.product.delete-multiple');
                });

                Route::resource('product', ProductController::class, ['as' => 'seller']);

                // seller sub-product
                Route::resource('sub-product', SubProductController::class, ['as' => 'seller']);

                // seller account
                Route::resource('account', SellerAccountController::class, ['as' => 'seller']);

                Route::group(['prefix' => 'payment-history'], function () {
                    Route::get('/', [PaymentHistoryController::class, 'index'])->name('seller.payment-history');
                    Route::post('/create', [PaymentHistoryController::class, 'store'])->name('seller.payment-history.store');
                    Route::post('/verify-payment', [PaymentHistoryController::class, 'verifyPayment'])->name('seller.payment-history.verify-payment');
                });
            });

        });
    });
