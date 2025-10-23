<?php

namespace App\Http\Controllers\Admin\PaymentMethod;

use App\Http\Controllers\Controller;
use App\Services\PaymentMethod\PaymentMethodService;
use Illuminate\Http\Request;

class PaymentMethodAdminController extends Controller
{
    protected $paymentMethodService;
    public function __construct(PaymentMethodService $paymentMethodService)
    {
        $this->paymentMethodService = $paymentMethodService;
    }
    public function getListPaymentMethod(Request $request)
    {
        try {
            $searchTerm = $request->input('search', '');
            $page = (int) $request->input('page', 1);

            $options = $this->paymentMethodService->getListPaymentMethod($searchTerm, $page, 10);

            return response()->json([
                'results' => $options['results'] ?? [],
                'has_more' => $options['has_more'] ?? false,
            ]);
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.admin'))->id() ?? null]);

            return response()->json([
                'results' => [],
                'has_more' => false,
            ], 500);
        }
    }
}
