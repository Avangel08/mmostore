<?php

namespace App\Http\Controllers\Admin\UserManager;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{

    public function __construct()
    {
    }

    public function index(Request $request)
    {
        return Inertia::render('UserManager/index', [
        ]);
    }
}
