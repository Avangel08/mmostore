<?php

namespace App\Http\Controllers\Admin\PaymentHistory;

use App\Http\Controllers\Controller;
use App\Services\PaymentTransaction\PaymentTransactionAdminService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentHistoryAdminController extends Controller
{
    protected $paymentTransactionAdminService;
    
    public function __construct(PaymentTransactionAdminService $paymentTransactionAdminService)
    {
        $this->paymentTransactionAdminService = $paymentTransactionAdminService;
    }

    public function index(Request $request)
    {
        return Inertia::render('PaymentHistory/index', [
            'paymentHistory' => fn() => $this->paymentTransactionAdminService->getPaginateData($request->all()),
        ]);
    }
}
