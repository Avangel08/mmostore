<?php

use App\Http\Controllers\Home\Auth\RegisteredUserController;
use App\Http\Controllers\Home\HomeController;
use Illuminate\Support\Facades\Route;

// Routes for primary domain mmostore.local (no middleware)
Route::domain('mmostore.local')
    ->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home.index');
        Route::get('register', [RegisteredUserController::class, 'create'])->name('home.register');
    });
