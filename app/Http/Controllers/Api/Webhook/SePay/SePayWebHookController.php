<?php

namespace App\Http\Controllers\Api\Webhook\SePay;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SePayWebHookController extends Controller
{
    public function callBack(Request $request){
        $data = $request->all();

        return response()->json([
            'status' => 'success',
            'message' => 'Webhook received successfully',
            'data' => $data
        ]);
    }
}
