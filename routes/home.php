<?php

use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Home\Register\RegisteredStoreController;
use Illuminate\Support\Facades\Route;

$domains = config('domains.hosts');

foreach ($domains as $domain) {
    Route::domain($domain)
        ->group(function () {
            Route::get('/', [HomeController::class, 'index'])->name('home.index');
            Route::get('register', [RegisteredStoreController::class, 'register'])->name('home.register');
            Route::post('register', [RegisteredStoreController::class, 'createStore'])->name('home.register.post');
        });
}