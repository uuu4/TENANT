<?php

declare(strict_types=1);

namespace App\Enums;

enum SyncType: string
{
    case STOCK = 'stock';
    case PRICE = 'price';
    case PRODUCTS = 'products';
    case BRANDS = 'brands';

    public function label(): string
    {
        return match ($this) {
            self::STOCK => 'Stock Sync',
            self::PRICE => 'Price Sync',
            self::PRODUCTS => 'Products Sync',
            self::BRANDS => 'Brands Sync',
        };
    }
}
