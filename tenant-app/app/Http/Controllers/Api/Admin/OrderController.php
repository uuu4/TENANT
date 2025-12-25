<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['nullable', 'string'],
        ]);

        $query = Order::query()
            ->with(['user', 'items.product', 'shipmentType'])
            ->orderByDesc('created_at');

        if ($request->filled('status')) {
            $status = OrderStatus::tryFrom($request->input('status'));
            if ($status) {
                $query->byStatus($status);
            }
        }

        $orders = $query->paginate(20);

        return response()->json($orders);
    }

    public function show(string $id): JsonResponse
    {
        $order = Order::with(['user', 'items.product.brand', 'shipmentType', 'approver'])
            ->findOrFail($id);

        return response()->json(['data' => $order]);
    }

    public function approve(Request $request, string $id): JsonResponse
    {
        $order = Order::findOrFail($id);

        if (!$order->canBeApproved()) {
            return response()->json([
                'message' => 'Order cannot be approved',
                'current_status' => $order->status->value,
            ], 422);
        }

        $order->approve($request->user());

        return response()->json([
            'message' => 'Order approved successfully',
            'data' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'approved_at' => $order->approved_at->toIso8601String(),
            ],
        ]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string'],
        ]);

        $order = Order::findOrFail($id);
        $newStatus = OrderStatus::from($request->input('status'));

        if (!$order->status->canTransitionTo($newStatus)) {
            return response()->json([
                'message' => 'Invalid status transition',
                'current_status' => $order->status->value,
                'requested_status' => $newStatus->value,
            ], 422);
        }

        $order->update(['status' => $newStatus]);

        return response()->json([
            'message' => 'Order status updated',
            'data' => [
                'id' => $order->id,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
            ],
        ]);
    }

    public function pending(): JsonResponse
    {
        $orders = Order::pending()
            ->with(['user', 'items'])
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'data' => $orders,
            'count' => $orders->count(),
        ]);
    }
}
