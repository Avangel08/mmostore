<?php

namespace App\Http\Controllers\Seller\Filter;

use App\Http\Controllers\Controller;
use App\Models\Mongo\Customers;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Get customers list with search functionality
     */
    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $limit = $request->get('limit', 20);

        $query = Customers::query();

        if (!empty($search)) {
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        $customers = $query->select(['_id', 'name', 'email'])
            ->orderBy('name', 'asc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $customers
        ]);
    }

    /**
     * Get customer by ID
     */
    public function show($id)
    {
        $customer = Customers::select(['_id', 'name', 'email'])
            ->where('_id', $id)
            ->first();

        if (!$customer) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $customer
        ]);
    }
}
