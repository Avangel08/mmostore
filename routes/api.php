<?php

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

Route::middleware(['body.token', 'auth:sanctum,seller', 'validate.subdomain', 'tenant.mongo'])
    ->prefix('v1')
    ->as('api.')
    ->group(function () {
        // seller api
        Route::group(['prefix' => 'accounts', 'as' => 'seller.'], function () {
            Route::post("/", [ApiSellerAccountController::class, 'store'])->name('accounts.store');
            Route::delete("/", [ApiSellerAccountController::class, 'destroy'])->name('accounts.destroy');
        });
    });
