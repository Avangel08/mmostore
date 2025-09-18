<?php

namespace App\Http\Controllers\Seller\Product;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('category_view')) {
        //     return abort(403);
        // }

        return Inertia::render('Category/index', [
            'categories' => fn () => $this->categoryService->getForTable($request),
        ]);
    }
}
