<?php

use App\Http\Controllers\Home\HomeController;
use Illuminate\Support\Facades\Route;

// Routes for primary domain mmostore.local (no middleware)
Route::domain('mmostore.local')
    ->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home.index');
    });



