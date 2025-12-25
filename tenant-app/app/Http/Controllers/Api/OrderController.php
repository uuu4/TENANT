<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ShipmentType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

final class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->with(['items.product', 'shipmentType'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($orders);
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $order = Order::query()
            ->where('user_id', $request->user()->id)
            ->with(['items.product.brand', 'shipmentType', 'approver'])
            ->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'subtotal' => $order->subtotal,
                'tax_amount' => $order->tax_amount,
                'total' => $order->total,
                'notes' => $order->notes,
                'shipment_type' => $order->shipmentType ? [
                    'id' => $order->shipmentType->id,
                    'name' => $order->shipmentType->name,
                    'cost' => $order->shipmentType->base_cost,
                ] : null,
                'approved_at' => $order->approved_at?->toIso8601String(),
                'approved_by' => $order->approver?->name,
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'sku' => $item->product->sku,
                        'name' => $item->product->name,
                        'brand' => $item->product->brand?->name,
                    ],
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->total_price,
                ]),
                'created_at' => $order->created_at->toIso8601String(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'shipment_type_id' => ['nullable', 'uuid', 'exists:shipment_types,id'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $user = $request->user();
        $cart = $user->cart;

        if (!$cart || $cart->isEmpty()) {
            return response()->json([
                'message' => 'Cart is empty',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $cart->load('items.product');

        // Validate stock availability
        foreach ($cart->items as $item) {
            if ($item->quantity > $item->product->stock_quantity) {
                return response()->json([
                    'message' => "Insufficient stock for {$item->product->name}",
                    'product_id' => $item->product_id,
                    'available_stock' => $item->product->stock_quantity,
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
        }

        $order = DB::transaction(function () use ($user, $cart, $request) {
            $subtotal = $cart->subtotal;
            $taxRate = 0.20; // 20% KDV
            $taxAmount = round($subtotal * $taxRate, 2);

            $shipmentType = null;
            $shipmentCost = 0;

            if ($request->filled('shipment_type_id')) {
                $shipmentType = ShipmentType::find($request->input('shipment_type_id'));
                $shipmentCost = $shipmentType?->base_cost ?? 0;
            }

            $total = $subtotal + $taxAmount + $shipmentCost;

            $order = Order::create([
                'user_id' => $user->id,
                'status' => OrderStatus::PENDING,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total' => $total,
                'shipment_type_id' => $shipmentType?->id,
                'notes' => $request->input('notes'),
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total_price' => $item->quantity * $item->unit_price,
                ]);
            }

            // Clear cart after order
            $cart->clear();

            return $order;
        });

        return response()->json([
            'message' => 'Order placed successfully',
            'data' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'total' => $order->total,
            ],
        ], Response::HTTP_CREATED);
    }

    public function shipmentTypes(): JsonResponse
    {
        $types = ShipmentType::active()
            ->orderBy('name')
            ->get(['id', 'name', 'code', 'base_cost']);

        return response()->json(['data' => $types]);
    }
}
