<?php

use App\Http\Controllers\Admin\Auth\RegisteredUserController;
use App\Http\Controllers\Home\HomeController;
use Illuminate\Support\Facades\Route;

Route::domain('mmostore.local')
    ->group(function () {
        Route::get('/', [HomeController::class, 'index'])->name('home.index');
        Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    });



