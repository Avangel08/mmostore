<?php

use App\Http\Controllers\Buyer\BuyerController;
use Illuminate\Support\Facades\Route;

Route::domain('{sub}.mmostore.local')
    ->middleware(['tenant.mongo'])
    ->group(function () {
        Route::get('/', [BuyerController::class, 'home'])->name('buyer.home');
    });



