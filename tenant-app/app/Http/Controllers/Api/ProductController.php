<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

final class ProductController extends Controller
{
    private const int PER_PAGE = 20;
    private const int CACHE_TTL = 300; // 5 minutes

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'brand_id' => ['nullable', 'uuid'],
            'category_id' => ['nullable', 'uuid'],
            'oem_code' => ['nullable', 'string', 'max:100'],
            'in_stock' => ['nullable', 'boolean'],
            'search' => ['nullable', 'string', 'max:255'],
            'sort_by' => ['nullable', 'in:name,price_usd,price_eur,stock_quantity,created_at'],
            'sort_order' => ['nullable', 'in:asc,desc'],
            'per_page' => ['nullable', 'integer', 'min:10', 'max:100'],
        ]);

        $cacheKey = 'products:' . md5(json_encode($request->all()));

        $products = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($request) {
            $query = Product::query()
                ->with(['brand', 'category'])
                ->active();

            // Apply filters
            if ($request->filled('brand_id')) {
                $query->byBrand($request->input('brand_id'));
            }

            if ($request->filled('category_id')) {
                $query->byCategory($request->input('category_id'));
            }

            if ($request->filled('oem_code')) {
                $query->byOemCode($request->input('oem_code'));
            }

            if ($request->boolean('in_stock')) {
                $query->inStock();
            }

            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('sku', 'LIKE', "%{$search}%")
                        ->orWhere('oem_code', 'LIKE', "%{$search}%");
                });
            }

            // Apply sorting
            $sortBy = $request->input('sort_by', 'name');
            $sortOrder = $request->input('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);

            $perPage = $request->input('per_page', self::PER_PAGE);

            return $query->paginate($perPage);
        });

        return response()->json($products);
    }

    public function show(string $id): JsonResponse
    {
        $cacheKey = "product:{$id}";

        $product = Cache::remember($cacheKey, self::CACHE_TTL, function () use ($id) {
            return Product::with(['brand', 'category'])
                ->active()
                ->findOrFail($id);
        });

        return response()->json([
            'data' => [
                'id' => $product->id,
                'sku' => $product->sku,
                'oem_code' => $product->oem_code,
                'name' => $product->name,
                'description' => $product->description,
                'price_usd' => $product->price_usd,
                'price_eur' => $product->price_eur,
                'stock_quantity' => $product->stock_quantity,
                'is_in_stock' => $product->isInStock(),
                'stock_synced_at' => $product->stock_synced_at?->toIso8601String(),
                'brand' => $product->brand ? [
                    'id' => $product->brand->id,
                    'name' => $product->brand->name,
                    'logo_url' => $product->brand->logo_url,
                ] : null,
                'category' => $product->category ? [
                    'id' => $product->category->id,
                    'name' => $product->category->name,
                ] : null,
            ],
        ]);
    }

    public function brands(): JsonResponse
    {
        $brands = Cache::remember('brands:active', self::CACHE_TTL, function () {
            return Brand::active()
                ->orderBy('name')
                ->get(['id', 'name', 'slug', 'logo_url']);
        });

        return response()->json(['data' => $brands]);
    }

    public function categories(): JsonResponse
    {
        $categories = Cache::remember('categories:tree', self::CACHE_TTL, function () {
            return Category::roots()
                ->with('children')
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug', 'parent_id']);
        });

        return response()->json(['data' => $categories]);
    }
}
