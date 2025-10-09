<?php

namespace App\Http\Controllers\Seller\Order;

use App\Http\Controllers\Controller;
use App\Services\Category\CategoryService;
use App\Services\Order\OrderService;
use App\Models\Mongo\Orders;
use App\Models\Mongo\Categories;
use App\Models\Mongo\Products;
use App\Services\Product\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected $orderService;
    protected $categoryService;
    protected $productService;

    public function __construct(
        OrderService $orderService,
        CategoryService $categoryService,
        ProductService $productService,
    )
    {
        $this->orderService = $orderService;
        $this->categoryService = $categoryService;
        $this->productService = $productService;
    }

    public function index(Request $request)
    {
        $requestData = $request->all();

        return Inertia::render('Order/index', [
            'orders' => fn() => $this->orderService->getForTable($requestData),
            'statusOptions' => Orders::STATUS,
            'paymentStatusOptions' => Orders::PAYMENT_STATUS,
            'categories' => $this->categoryService->getActive(),
            'products' => $this->productService->getActive(),
        ]);
    }

}
