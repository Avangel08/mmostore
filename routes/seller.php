<?php

use App\Http\Controllers\Seller\Category\CategoryController;
use App\Http\Controllers\Seller\CustomerManager\CustomerManagerController;
use App\Http\Controllers\Seller\DashBoardController;
use App\Http\Controllers\Seller\LoginController;
use App\Http\Controllers\Seller\Order\OrderController;
use App\Http\Controllers\Seller\PaymentHistory\PaymentHistoryController;
use App\Http\Controllers\Seller\PaymentMethod\PaymentMethodController;
use App\Http\Controllers\Seller\Plan\PlanController;
use App\Http\Controllers\Seller\Product\ProductController;
use App\Http\Controllers\Seller\Product\SellerAccountController;
use App\Http\Controllers\Seller\Product\SubProductController;
use App\Http\Controllers\Seller\Profile\ProfileController;
use App\Http\Controllers\Seller\Setting\ThemeSettingController;
use App\Http\Controllers\Seller\Auth\ForgotPasswordController;
use App\Http\Controllers\Seller\Auth\ResetPasswordController;
use Illuminate\Support\Facades\Route;

Route::middleware(['validate.subdomain', 'tenant.mongo'])
    ->group(function () {
        Route::prefix('admin')->group(function () {
            Route::group(['prefix' => 'login'], function () {
                Route::get('/', [LoginController::class, 'login'])->name('seller.login');
                Route::post('/', [LoginController::class, 'authenticate'])->name('seller.login.post');
                Route::get('/magic', [LoginController::class, 'magicLogin'])->name('seller.magic-login')->middleware('signed');
            });

            Route::get('forgot-password', [ForgotPasswordController::class, 'create'])->name('seller.forgot-password');
            Route::post('forgot-password', [ForgotPasswordController::class, 'store'])->name('seller.forgot-password.post');
            Route::get('forgot-password/success', [ForgotPasswordController::class, 'success'])->name('seller.forgot-password.success');
            Route::get('reset-password/{token}', [ResetPasswordController::class, 'create'])->name('seller.reset-password');
            Route::post('reset-password', [ResetPasswordController::class, 'store'])->name('seller.reset-password.post');

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
                    Route::post('/upload-image', [ProfileController::class, 'uploadImage'])->name('seller.profile.upload-image');
                    Route::post('/create-token', [ProfileController::class, 'createToken'])->name('seller.profile.create-token');
                    Route::delete('/delete-token/{tokenId}', [ProfileController::class, 'deleteToken'])->name('seller.profile.delete-token');
                });

                Route::group(['prefix' => 'category'], function () {
                    Route::delete('/delete-multiple', [CategoryController::class, 'deleteMultipleCategories'])->name('seller.category.delete-multiple');
                });
                Route::resource('category', CategoryController::class, ['as' => 'seller']);

                Route::group(['prefix' => 'product'], function () {
                    Route::delete('/delete-multiple', [ProductController::class, 'deleteMultipleProduct'])->name('seller.product.delete-multiple');
                });

                Route::resource('product', ProductController::class, ['as' => 'seller']);

                Route::resource('sub-product', SubProductController::class, ['as' => 'seller']);

                Route::group(['prefix' => 'account'], function () {
                    Route::get('/status-options', [SellerAccountController::class, 'getStatusOptions'])->name('seller.account.status-options');
                    Route::get('/download-unsold-account/{subProductId}', [SellerAccountController::class, 'downloadUnsoldAccounts'])->name('seller.account.download-unsold-account');
                });
                Route::resource('account', SellerAccountController::class, ['as' => 'seller']);

                Route::group(['prefix' => 'payment-history'], function () {
                    Route::get('/', [PaymentHistoryController::class, 'index'])->name('seller.payment-history');
                    Route::get('/edit', [PaymentHistoryController::class, 'edit'])->name('seller.payment-history.edit');
                    Route::post('/create', [PaymentHistoryController::class, 'store'])->name('seller.payment-history.store');
                    Route::post('/verify-payment', [PaymentHistoryController::class, 'verifyPayment'])->name('seller.payment-history.verify-payment');
                });

                Route::group(['prefix' => 'theme-settings'], function() {
                    Route::get('/', [ThemeSettingController::class, 'index'])->name('seller.theme-settings');
                    Route::post('/update', [ThemeSettingController::class, 'update'])->name('seller.theme-settings.update');
                });
                Route::group(['prefix' => 'customer-manager'], function () {
                    Route::get('/', [CustomerManagerController::class, 'index'])->name('seller.customer-manager.index');
                    Route::get('/edit/{id}', [CustomerManagerController::class, 'edit'])->name('seller.customer-manager.edit');
                    Route::post('/deposit', [CustomerManagerController::class, 'deposit'])->name('seller.customer-manager.deposit');
                }); 

                Route::group(['prefix' => 'plans'], function () {
                    Route::get("/", [PlanController::class, 'index'])->name('seller.plan.index');
                });

                Route::group(['prefix' => 'order'], function () {
                    Route::get("/", [OrderController::class, 'index'])->name('seller.order');
                });

                Route::group(['prefix' => 'payment-method'], function () {
                    Route::get('/', [PaymentMethodController::class, 'index'])->name('seller.payment-method');
                    Route::get('/edit/{id}', [PaymentMethodController::class, 'edit'])->name('seller.payment-method.edit');
                    Route::get('/create', [PaymentMethodController::class, 'create'])->name('seller.payment-method.create');
                    Route::post('/create', [PaymentMethodController::class, 'store'])->name('seller.payment-method.store');
                    Route::put('/update/{id}', [PaymentMethodController::class, 'update'])->name('seller.payment-method.update');
                    Route::post('/verify-payment', [PaymentMethodController::class, 'verifyPayment'])->name('seller.payment-method.verify-payment');
                    Route::post('/verify-sepay', [PaymentMethodController::class, 'verifySePay'])->name('seller.payment-method.verify-sepay');
                    Route::delete('/destroy/{id}', [PaymentMethodController::class, 'destroy'])->name('seller.payment-method.destroy');
                });
            });

        });
    });
