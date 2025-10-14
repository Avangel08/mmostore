<?php

use App\Http\Controllers\Home\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Home\Register\RegisteredStoreController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home.index');
Route::get('register', [RegisteredStoreController::class, 'register'])->name('home.register');
Route::post('register', [RegisteredStoreController::class, 'createStore'])->name('home.register.post');
Route::get('login', [AuthenticatedSessionController::class, 'index'])->name('home.login');
Route::post('login', [AuthenticatedSessionController::class, 'login'])->name('home.login.post');
Route::get('go-to-store/{id}', [AuthenticatedSessionController::class, 'goToStore'])->name('home.go-to-store');