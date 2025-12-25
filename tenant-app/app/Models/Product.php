<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Product extends Model
{
    use HasFactory, HasUuids;

    protected $appends = ['is_in_stock'];

    protected $fillable = [
        'brand_id',
        'category_id',
        'sku',
        'oem_code',
        'name',
        'description',
        'price_usd',
        'price_eur',
        'stock_quantity',
        'wms_product_id',
        'stock_synced_at',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_usd' => 'decimal:2',
            'price_eur' => 'decimal:2',
            'stock_quantity' => 'integer',
            'stock_synced_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    public function scopeByBrand($query, string $brandId)
    {
        return $query->where('brand_id', $brandId);
    }

    public function scopeByCategory($query, string $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByOemCode($query, string $oemCode)
    {
        return $query->where('oem_code', 'LIKE', "%{$oemCode}%");
    }

    public function getIsInStockAttribute(): bool
    {
        return $this->stock_quantity > 0;
    }
}
