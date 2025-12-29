<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Create Brands
        $bosch = Brand::firstOrCreate(['slug' => 'bosch'], ['name' => 'Bosch', 'is_active' => true]);
        $siemens = Brand::firstOrCreate(['slug' => 'siemens'], ['name' => 'Siemens', 'is_active' => true]);
        $philips = Brand::firstOrCreate(['slug' => 'philips'], ['name' => 'Philips', 'is_active' => true]);

        // Create Category
        $category = Category::firstOrCreate(['slug' => 'elektronik'], ['name' => 'Elektronik']);

        // Create Products
        $products = [
            ['brand_id' => $bosch->id, 'category_id' => $category->id, 'name' => 'Elektrikli Matkap Pro 750W', 'sku' => 'BSH-001', 'price_usd' => 149.99, 'price_eur' => 139.99, 'stock_quantity' => 50],
            ['brand_id' => $bosch->id, 'category_id' => $category->id, 'name' => 'Akülü Vidalama Seti', 'sku' => 'BSH-002', 'price_usd' => 89.99, 'price_eur' => 79.99, 'stock_quantity' => 75],
            ['brand_id' => $siemens->id, 'category_id' => $category->id, 'name' => 'Endüstriyel Kontrol Paneli', 'sku' => 'SMN-001', 'price_usd' => 599.99, 'price_eur' => 549.99, 'stock_quantity' => 20],
            ['brand_id' => $siemens->id, 'category_id' => $category->id, 'name' => 'PLC Modülü S7-1200', 'sku' => 'SMN-002', 'price_usd' => 349.99, 'price_eur' => 319.99, 'stock_quantity' => 35],
            ['brand_id' => $philips->id, 'category_id' => $category->id, 'name' => 'LED Aydınlatma Seti', 'sku' => 'PHL-001', 'price_usd' => 79.99, 'price_eur' => 69.99, 'stock_quantity' => 100],
            ['brand_id' => $philips->id, 'category_id' => $category->id, 'name' => 'Endüstriyel Lamba 400W', 'sku' => 'PHL-002', 'price_usd' => 129.99, 'price_eur' => 119.99, 'stock_quantity' => 60],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(
                ['sku' => $product['sku']],
                array_merge($product, ['is_active' => true])
            );
        }

        $this->command->info('6 ürün oluşturuldu!');
    }
}
