<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('brand_id')->nullable();
            $table->uuid('category_id')->nullable();
            $table->string('sku')->unique();
            $table->string('oem_code')->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price_usd', 12, 2)->default(0);
            $table->decimal('price_eur', 12, 2)->default(0);
            $table->integer('stock_quantity')->default(0);
            $table->string('wms_product_id')->nullable();
            $table->timestamp('stock_synced_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->foreign('brand_id')
                ->references('id')
                ->on('brands')
                ->onDelete('set null');
                
            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->onDelete('set null');
                
            $table->index('brand_id');
            $table->index('category_id');
            $table->index('oem_code');
            $table->index('is_active');
            $table->index('stock_quantity');
            $table->index('wms_product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
