<?php

namespace App\Http\Controllers\Seller\CurrencyRate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\CurrencyRate\CurrencyRateRequest;
use App\Models\Mongo\CurrencyRateSeller;
use App\Services\CurrencyRateSeller\CurrencyRateSellerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CurrencyRateController extends Controller
{
    protected $currencyRateSellerService;
    public function __construct(CurrencyRateSellerService $currencyRateSellerService)
    {
        $this->currencyRateSellerService = $currencyRateSellerService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->all();
        return Inertia::render('CurrencyRate/index', [
            'currencyRates' => $this->currencyRateSellerService->getForTable($filters),
            'statusList' => array_flip(CurrencyRateSeller::STATUS),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json([
            'statusList' => array_flip(CurrencyRateSeller::STATUS),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CurrencyRateRequest $request)
    {
        $data = $request->validated();
        $created = CurrencyRateSeller::create($data);
        return back()->with($created ? 'success' : 'error', $created ? 'Created successfully' : 'Create failed');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return abort(404);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $item = CurrencyRateSeller::find($id);
        if (!$item) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json([
            'statusList' => array_flip(CurrencyRateSeller::STATUS),
            'currencyRate' => $item,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CurrencyRateRequest $request, string $id)
    {
        $item = CurrencyRateSeller::find($id);
        if (!$item) {
            return back()->with('error', 'Not found');
        }
        $data = $request->validated();
        $ok = $item->update($data);
        return back()->with($ok ? 'success' : 'error', $ok ? 'Updated successfully' : 'Update failed');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $item = CurrencyRateSeller::find($id);
        if (!$item) {
            return back()->with('error', 'Not found');
        }
        $ok = $item->delete();
        return back()->with($ok ? 'success' : 'error', $ok ? 'Deleted successfully' : 'Delete failed');
    }
}
