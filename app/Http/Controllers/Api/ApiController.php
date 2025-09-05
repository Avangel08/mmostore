<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function user(Request $request)
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }
}


