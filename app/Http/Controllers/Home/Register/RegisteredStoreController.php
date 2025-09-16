<?php

namespace App\Http\Controllers\Home\Register;

use App\Http\Controllers\Controller;
use App\Http\Requests\Home\RegisterStore\RegisterStoreRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredStoreController extends Controller
{
    /**
     * Display the registration view.
     */
    public function register(): Response
    {
        return Inertia::render('Register/index');
    }

    public function createStore(RegisterStoreRequest $registerStoreRequest): Response
    {
        $data = $registerStoreRequest->validated();
        dd($data);
        return true;
    }
}
