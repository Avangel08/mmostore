<?php

namespace App\Http\Controllers\Seller\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\Product\AccountRequest;
use App\Services\Product\ImportAccountHistoryService;
use App\Services\Product\SellerAccountService;
use App\Services\Product\SubProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SellerAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public $sellerAccountService;

    public $subProductService;

    public $importAccountHistoryService;

    public function __construct(SellerAccountService $sellerAccountService, SubProductService $subProductService, ImportAccountHistoryService $importAccountHistoryService)
    {
        $this->sellerAccountService = $sellerAccountService;
        $this->subProductService = $subProductService;
        $this->importAccountHistoryService = $importAccountHistoryService;
    }

    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AccountRequest $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('subproduct_create')) {
        //     return abort(403);
        // }

        try {
            $data = $request->validated();
            $this->sellerAccountService->processAccountFile($data);

            return back()->with('success', 'File uploaded successfully and is pending processing');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($sub, string $subProductId, Request $request)
    {
        // if (auth(config('guard.seller'))->user()->cannot('account_edit')) {
        //     return abort(403);
        // }
        $subProduct = $this->subProductService->getById($subProductId);
        if (! $subProduct) {
            abort(404);
        }

        return Inertia::render('Product/Account/index', [
            'subProduct' => fn () => $this->subProductService->getById($subProductId),
            'importHistory' => fn () => $this->importAccountHistoryService->getForTable($subProductId, $request),
            'accounts' => fn () => $this->sellerAccountService->getForTable($subProductId, $request),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AccountRequest $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($sub, string $subProductId, Request $request)
    {
        try {
            $subProduct = $this->subProductService->getById($subProductId);
            if (! $subProduct) {
                throw new \Exception('Sub product not found');
            }
            $this->sellerAccountService->startDeleteUnsoldAccount($subProductId);

            return back()->with('success', 'Success. Unsold accounts will be deleted after a few minutes');
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }

    public function downloadUnsoldAccounts($sub, $subProductId, Request $request)
    {
        try {
            return $this->sellerAccountService->streamDownloadUnsoldAccounts($subProductId);
        } catch (\Exception $e) {
            \Log::error($e, ['ip' => $request->ip(), 'user_id' => auth(config('guard.seller'))->id() ?? null]);

            return back()->with('error', $e->getMessage());
        }
    }
}
