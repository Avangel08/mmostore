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

Route::prefix('v1')
    ->as('api.')
    ->group(function () {
        // seller api
        Route::middleware((['auth:sanctum', 'validate.subdomain', 'tenant.mongo']))->group(function () {
            Route::group(['prefix' => 'accounts', 'as' => 'seller.'], function () {
                Route::post("/", [ApiSellerAccountController::class, 'store'])->name('accounts.store');
                Route::delete("/", [ApiSellerAccountController::class, 'destroy'])->name('accounts.destroy');
            });
        });
    });
