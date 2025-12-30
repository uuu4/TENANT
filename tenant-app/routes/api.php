<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\UpdateController;
use App\Http\Controllers\Admin\SiteSettingController;
use App\Http\Controllers\Admin\NewsController as AdminNewsController;
use App\Http\Controllers\Admin\ProductImportController;
use App\Http\Controllers\PublicContentController;
use App\Http\Controllers\Webhook\WmsWebhookController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\LicenseMiddleware;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (no auth required)
Route::post('/auth/login', [AuthController::class, 'login']);

// Public content routes (no auth required)
Route::get('/content/settings', [PublicContentController::class, 'settings']);
Route::get('/content/news', [PublicContentController::class, 'news']);
Route::get('/content/news/{id}', [PublicContentController::class, 'newsItem']);

// Webhook routes (no auth, but signature validated)
Route::post('/wms/webhook', [WmsWebhookController::class, 'handle']);

// Protected routes (require authentication + license validation)
Route::middleware(['auth:sanctum', LicenseMiddleware::class])->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Products (read-only for all authenticated users)
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/brands', [ProductController::class, 'brands']);
    Route::get('/categories', [ProductController::class, 'categories']);

    // Cart
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::put('/cart/items/{productId}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{productId}', [CartController::class, 'removeItem']);
    Route::delete('/cart', [CartController::class, 'clear']);

    // Orders (user's own orders)
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/shipment-types', [OrderController::class, 'shipmentTypes']);

    // Admin routes
    Route::prefix('admin')->middleware(AdminMiddleware::class)->group(function () {
        
        // Order management
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/pending', [AdminOrderController::class, 'pending']);
        Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
        Route::post('/orders/{id}/approve', [AdminOrderController::class, 'approve']);
        Route::put('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);

        // Site settings management
        Route::get('/settings', [SiteSettingController::class, 'index']);
        Route::get('/settings/group/{group}', [SiteSettingController::class, 'group']);
        Route::put('/settings', [SiteSettingController::class, 'update']);
        Route::put('/settings/{key}', [SiteSettingController::class, 'updateSingle']);

        // News management
        Route::get('/news', [AdminNewsController::class, 'index']);
        Route::post('/news', [AdminNewsController::class, 'store']);
        Route::get('/news/{news}', [AdminNewsController::class, 'show']);
        Route::put('/news/{news}', [AdminNewsController::class, 'update']);
        Route::delete('/news/{news}', [AdminNewsController::class, 'destroy']);
        Route::post('/news/{news}/toggle-publish', [AdminNewsController::class, 'togglePublish']);

        // Product import
        Route::get('/imports', [ProductImportController::class, 'index']);
        Route::post('/imports/upload', [ProductImportController::class, 'upload']);
        Route::post('/imports/{importId}/execute', [ProductImportController::class, 'import']);
        
        // ERP connections
        Route::get('/erp/connections', [ProductImportController::class, 'erpConnections']);
        Route::post('/erp/connections', [ProductImportController::class, 'saveErpConnection']);
        Route::post('/erp/test', [ProductImportController::class, 'testErpConnection']);
        Route::post('/erp/sync', [ProductImportController::class, 'syncErp']);

        // Product management
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // System updates
        Route::get('/updates/check', [UpdateController::class, 'checkForUpdates']);
        Route::post('/updates/perform', [UpdateController::class, 'performUpdate']);

        // Activity Logs (MongoDB)
        Route::prefix('logs')->group(function () {
            Route::get('/', [ActivityLogController::class, 'index']);
            Route::get('/stats', [ActivityLogController::class, 'stats']);
            Route::get('/recent', [ActivityLogController::class, 'recent']);
            Route::get('/actions', [ActivityLogController::class, 'actions']);
            Route::get('/model-types', [ActivityLogController::class, 'modelTypes']);
            Route::get('/user/{userId}', [ActivityLogController::class, 'forUser']);
            Route::get('/model/{modelType}/{modelId?}', [ActivityLogController::class, 'forModel']);
            Route::get('/{id}', [ActivityLogController::class, 'show']);
        });
    });
});
