<?php

use App\Http\Controllers\Api\Webhook\SePay\SePayWebHookController;
use App\Http\Controllers\Seller\Product\ApiSellerAccountController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

$mainDomain = config('app.main_domain');
Route::group(['prefix' => 'v1','as' => 'api.'], function () use ($mainDomain) {
        // seller api
        Route::domain('{sub}.' . $mainDomain)->middleware((['auth:seller_api', 'validate.subdomain', 'tenant.mongo', 'validate.seller.token']))->group(function () {
            Route::group(['prefix' => 'accounts', 'as' => 'seller.'], function () {
                Route::post("/", [ApiSellerAccountController::class, 'store'])->name('accounts.store');
                Route::delete("/", [ApiSellerAccountController::class, 'destroy'])->name('accounts.destroy');
            });
        });

        // Webhook
        // Route::middleware((['tenant.mongo']))->group(function () {
        //     Route::group(['prefix' => 'webhook'], function () {
        //         Route::any("/sepay", [SePayWebHookController::class, 'callBack'])->name('webhook.sepay');
        //     });
        // });

        Route::group(['prefix' => 'webhook'], function () {
            Route::any("/sepay", [SePayWebHookController::class, 'callBack'])->name('webhook.sepay');
        });
    });
