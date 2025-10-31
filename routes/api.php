<?php
use App\Http\Controllers\Api\Public\ResourceMmo\ResourceMmoApiController;
use App\Http\Controllers\Api\Seller\Product\ProductApiController;
use App\Http\Controllers\Api\Seller\Product\SellerAccountApiController;
use App\Http\Controllers\Api\Buyer\Product\ProductController;
use App\Http\Controllers\Api\Buyer\Order\OrderController;
use App\Http\Controllers\Api\Webhook\SePay\SePayWebHookAdminController;
use App\Http\Controllers\Api\Webhook\SePay\SePayWebHookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

$mainDomain = config('app.main_domain');
Route::group(['prefix' => 'v1','as' => 'api.'], function () use ($mainDomain) {
        // seller api
        Route::middleware((['auth:seller_api', 'validate.subdomain', 'tenant.mongo', 'validate.seller.token']))->group(function () {
            Route::group(['prefix' => 'accounts'], function () {
                Route::post("/", [SellerAccountApiController::class, 'store'])->name('seller.accounts.store');
                Route::delete("/", [SellerAccountApiController::class, 'destroy'])->name('seller.accounts.destroy');
            });

            Route::apiResource('products', ProductApiController::class, ['as' => 'seller'])->only(['index', 'show']);
        });

        // buyer api
        Route::middleware((['validate.subdomain', 'tenant.mongo', 'auth:buyer_api', 'validate.buyer.token']))->group(function () {
            Route::group(['prefix' => 'product', 'as' => 'buyer.'], function () {
                Route::get('/', [ProductController::class, 'index'])->name('product.index');
                Route::get('/{id}', [ProductController::class, 'show'])->name('product.show');
            });

            Route::group(['prefix' => 'order', 'as' => 'buyer.'], function () {
                Route::get('/', [OrderController::class, 'index'])->name('order.index');
                Route::get('/{orderNumber}', [OrderController::class, 'show'])->name('order.show');
                Route::post('/checkout', [OrderController::class, 'checkout'])->name('order.checkout');
            });
        });

        Route::group(['prefix' => 'webhook'], function () {
            // Webhook Seller
            Route::group(['middleware' => ["validate.subdomain", "tenant.mongo"]], function () {
                Route::any("/sepay", [SePayWebHookController::class, 'callBack'])->name('webhook.sepay');
            });

            Route::any("/sepay-admin", [SePayWebHookAdminController::class, 'callBack'])->name('admin.webhook.sepay');
        });

        // resource market
        Route::group(['prefix' => 'resources'], function () {
            Route::get('/stores', [ResourceMmoApiController::class, 'getStores'])->name('resources.stores.index');
            Route::get('/categories', [ResourceMmoApiController::class, 'getStoreCategories'])->name('resources.categories.index');
            Route::get('/banner', [ResourceMmoApiController::class, 'getBanner'])->name('resources.banner.index');
        });

        // resource market
        Route::group(['prefix' => 'resources'], function () {
            Route::get('/stores', [ResourceMmoApiController::class, 'getStores'])->name('resources.stores.index');
            Route::get('/categories', [ResourceMmoApiController::class, 'getStoreCategories'])->name('resources.categories.index');
            Route::get('/banner', [ResourceMmoApiController::class, 'getBanner'])->name('resources.banner.index');
        });
    });
