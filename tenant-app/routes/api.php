<?php

declare(strict_types=1);

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\UpdateController;
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

        // System updates
        Route::get('/updates/check', [UpdateController::class, 'checkForUpdates']);
        Route::post('/updates/perform', [UpdateController::class, 'performUpdate']);
    });
});
