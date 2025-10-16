<?php

namespace App\Http\Controllers\Api\Webhook\SePay;

use App\Http\Controllers\Controller;
use App\Models\Mongo\WebhookSeller;
use Illuminate\Http\Request;

class SePayWebHookController extends Controller
{
    public function callBack(Request $request){
        $data = $request->all();
        WebhookSeller::create([
            'platform' => 'sepay',
            'gateway' => $data['gateway'] ?? '',
            'data' => $data,
            'date_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Webhook received successfully',
            'data' => $data
        ]);
    }
}
