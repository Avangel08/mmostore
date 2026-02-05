<?php

namespace App\Http\Controllers\Admin\CurrencyRate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CurrencyRate\CurrencyRateAdminRequest;
use App\Models\MySQL\CurrencyRates;
use App\Services\CurrencyRate\CurrencyRateService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CurrencyRateAdminController extends Controller
{
    protected $currencyRateAdminService;
    public function __construct(CurrencyRateService $currencyRateAdminService)
    {
        $this->currencyRateAdminService = $currencyRateAdminService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('CurrencyRate/index', [
            'currencyRates' => fn() => $this->currencyRateAdminService->getPaginateData($request->all()),
            'statusList' => fn() => CurrencyRates::STATUS_LIST,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json([
            'statusList' => CurrencyRates::STATUS_LIST,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CurrencyRateAdminRequest $request)
    {
        $data = $request->validated();
        $created = CurrencyRates::create($data);
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
        $item = CurrencyRates::find($id);
        if (!$item) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json([
            'currencyRate' => $item,
            'statusList' => CurrencyRates::STATUS_LIST,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CurrencyRateAdminRequest $request, string $id)
    {
        $item = CurrencyRates::find($id);
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
        $item = CurrencyRates::find($id);
        if (!$item) {
            return back()->with('error', 'Not found');
        }
        $ok = $item->delete();
        return back()->with($ok ? 'success' : 'error', $ok ? 'Deleted successfully' : 'Delete failed');
    }
}
