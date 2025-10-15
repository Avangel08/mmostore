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

Route::middleware(['body.token', 'auth:sanctum', 'validate.subdomain', 'tenant.mongo'])
    ->prefix('v1')
    ->group(function () {
        Route::apiResource('accounts', ApiSellerAccountController::class);
    });
