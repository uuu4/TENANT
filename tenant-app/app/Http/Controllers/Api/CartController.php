<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class CartController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cart = $request->user()->getOrCreateCart();
        $cart->load('items.product.brand');

        return response()->json([
            'data' => [
                'id' => $cart->id,
                'items' => $cart->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product' => [
                        'id' => $item->product->id,
                        'sku' => $item->product->sku,
                        'name' => $item->product->name,
                        'price_usd' => $item->product->price_usd,
                        'price_eur' => $item->product->price_eur,
                        'stock_quantity' => $item->product->stock_quantity,
                        'brand' => $item->product->brand?->name,
                    ],
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total' => $item->total,
                ]),
                'subtotal' => $cart->subtotal,
                'item_count' => $cart->item_count,
            ],
        ]);
    }

    public function addItem(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => ['required', 'uuid'],
            'quantity' => ['sometimes', 'integer', 'min:1', 'max:999'],
        ]);

        $product = Product::active()->findOrFail($request->input('product_id'));

        if (!$product->is_in_stock) {
            return response()->json([
                'message' => 'Product is out of stock',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $cart = $request->user()->getOrCreateCart();
        $quantity = $request->input('quantity', 1);

        // Check stock availability
        $existingItem = $cart->items()->where('product_id', $product->id)->first();
        $totalQuantity = $quantity + ($existingItem?->quantity ?? 0);

        if ($totalQuantity > $product->stock_quantity) {
            return response()->json([
                'message' => 'Requested quantity exceeds available stock',
                'available_stock' => $product->stock_quantity,
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $cartItem = $cart->addItem($product, $quantity);

        return response()->json([
            'message' => 'Item added to cart',
            'data' => [
                'id' => $cartItem->id,
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'unit_price' => $cartItem->unit_price,
                'total' => $cartItem->total,
            ],
        ]);
    }

    public function updateItem(Request $request, string $productId): JsonResponse
    {
        $request->validate([
            'quantity' => ['required', 'integer', 'min:0', 'max:999'],
        ]);

        $cart = $request->user()->getOrCreateCart();
        $quantity = $request->input('quantity');

        if ($quantity > 0) {
            $product = Product::active()->findOrFail($productId);

            if ($quantity > $product->stock_quantity) {
                return response()->json([
                    'message' => 'Requested quantity exceeds available stock',
                    'available_stock' => $product->stock_quantity,
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        $cartItem = $cart->updateItemQuantity($productId, $quantity);

        if (!$cartItem && $quantity > 0) {
            return response()->json([
                'message' => 'Item not found in cart',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'message' => $quantity > 0 ? 'Item quantity updated' : 'Item removed from cart',
            'data' => $cartItem ? [
                'id' => $cartItem->id,
                'quantity' => $cartItem->quantity,
                'total' => $cartItem->total,
            ] : null,
        ]);
    }

    public function removeItem(Request $request, string $productId): JsonResponse
    {
        $cart = $request->user()->getOrCreateCart();
        $removed = $cart->removeItem($productId);

        if (!$removed) {
            return response()->json([
                'message' => 'Item not found in cart',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'message' => 'Item removed from cart',
        ]);
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $request->user()->cart;

        if ($cart) {
            $cart->clear();
        }

        return response()->json([
            'message' => 'Cart cleared',
        ]);
    }
}
