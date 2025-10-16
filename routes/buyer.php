<?php

use App\Http\Controllers\Buyer\Auth\ForgotPasswordController;
use App\Http\Controllers\Buyer\Auth\ResetPasswordController;
use App\Http\Controllers\Buyer\PaymentHistory\PaymentHistoryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Buyer\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Buyer\Auth\RegisteredUserController;
use App\Http\Controllers\Buyer\BuyerController;
use App\Http\Controllers\Buyer\Deposit\DepositController;
use App\Http\Controllers\Buyer\Product\ProductController;
use App\Http\Controllers\Buyer\Order\OrderController;
use App\Http\Controllers\Buyer\Profile\ProfileController;
// use App\Http\Controllers\Buyer\PaymentHistory\PaymentHistoryController;

Route::middleware(['validate.subdomain', 'tenant.mongo'])
    ->group(function () {
        Route::get('/', [BuyerController::class, 'home'])->name('buyer.home');
        Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('buyer.login');
        Route::get('/register', [RegisteredUserController::class, 'create'])->name('buyer.register');
        Route::post('/register', [RegisteredUserController::class, 'store']);
        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('buyer.logout');
        Route::post('forgot-password', [ForgotPasswordController::class, 'store'])->name('buyer.forgot-password.store');
        Route::get('reset-password/{token}', [ResetPasswordController::class, 'create'])->name('buyer.password.reset');
        Route::post('reset-password', [ResetPasswordController::class, 'store'])->name('buyer.password.store');

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

        Route::middleware('checkauth:buyer')->group(function () {
            Route::group(['prefix' => 'order'], function () {
                Route::get('/', [OrderController::class, 'index'])->name('buyer.order.page');
                Route::get('/{orderNumber}', [OrderController::class, 'show'])->name('buyer.order.show');
                Route::get('/{orderNumber}/download', [OrderController::class, 'download'])->name('buyer.order.download');
            });

            Route::group(['prefix' => 'profile'], function () {
                Route::get('/', [ProfileController::class, 'index'])->name('buyer.profile');
                Route::put('/update-info', [ProfileController::class, 'updateInfo'])->name('buyer.profile.update-info');
                Route::put('/change-password', [ProfileController::class, 'changePassword'])->name('buyer.profile.change-password');
                Route::post('/upload-image', [ProfileController::class, 'uploadImage'])->name('buyer.profile.upload-image');
                Route::post('/create-token', [ProfileController::class, 'createToken'])->name('buyer.profile.create-token');
                Route::delete('/delete-token/{tokenId}', [ProfileController::class, 'deleteToken'])->name('buyer.profile.delete-token');
            });

            Route::group(['prefix' => 'payment-history'], function () {
                Route::get('/', [PaymentHistoryController::class, 'index'])->name('buyer.payment-history');
            });
        });
    });



