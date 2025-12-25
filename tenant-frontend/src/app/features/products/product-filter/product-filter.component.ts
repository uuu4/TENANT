import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Brand, Category, ProductFilter } from '../../../core/models';

@Component({
    selector: 'app-product-filter',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <aside class="w-64 bg-white border-r border-gray-200 p-4 h-full overflow-y-auto">
      <!-- Search -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-900 mb-2">Search</label>
        <input 
          type="text"
          [ngModel]="filters().search || ''"
          (ngModelChange)="updateFilter('search', $event)"
          placeholder="Search products..."
          class="input text-sm"
        />
      </div>

      <!-- Brand Filter -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Brands
        </h3>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          @for (brand of brands(); track brand.id) {
            <label class="flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                [checked]="filters().brand_id === brand.id"
                (change)="toggleBrand(brand.id)"
                class="w-4 h-4 rounded border-gray-300 text-primary-600 
                       focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700 group-hover:text-primary-600">
                {{ brand.name }}
              </span>
            </label>
          }
        </div>
      </div>

      <!-- Category Filter -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Categories
        </h3>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          @for (category of categories(); track category.id) {
            <label class="flex items-center cursor-pointer group">
              <input 
                type="radio" 
                name="category"
                [checked]="filters().category_id === category.id"
                (change)="updateFilter('category_id', category.id)"
                class="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700 group-hover:text-primary-600">
                {{ category.name }}
              </span>
            </label>
            @if (category.children?.length) {
              <div class="ml-4 space-y-2">
                @for (child of category.children; track child.id) {
                  <label class="flex items-center cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category"
                      [checked]="filters().category_id === child.id"
                      (change)="updateFilter('category_id', child.id)"
                      class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="ml-2 text-sm text-gray-600 group-hover:text-primary-600">
                      {{ child.name }}
                    </span>
                  </label>
                }
              </div>
            }
          }
        </div>
      </div>

      <!-- OEM Search -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
          OEM Code
        </label>
        <input 
          type="text"
          [ngModel]="filters().oem_code || ''"
          (ngModelChange)="updateFilter('oem_code', $event)"
          placeholder="Search OEM..."
          class="input text-sm"
        />
      </div>

      <!-- Stock Filter -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Availability
        </h3>
        <div class="space-y-2">
          <label class="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="stock"
              [checked]="filters().in_stock === true"
              (change)="updateFilter('in_stock', true)"
              class="w-4 h-4 text-primary-600"
            />
            <span class="ml-2 text-sm text-gray-700">In Stock Only</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input 
              type="radio" 
              name="stock"
              [checked]="filters().in_stock !== true"
              (change)="updateFilter('in_stock', undefined)"
              class="w-4 h-4 text-primary-600"
            />
            <span class="ml-2 text-sm text-gray-700">Show All</span>
          </label>
        </div>
      </div>

      <!-- Sort -->
      <div class="mb-6">
        <label class="block text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">
          Sort By
        </label>
        <select 
          [ngModel]="filters().sort_by || 'name'"
          (ngModelChange)="updateFilter('sort_by', $event)"
          class="input text-sm">
          <option value="name">Name</option>
          <option value="price_usd">Price (USD)</option>
          <option value="price_eur">Price (EUR)</option>
          <option value="stock_quantity">Stock</option>
        </select>
      </div>

      <!-- Clear Filters -->
      <button 
        (click)="clearAllFilters()"
        class="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 
               text-gray-700 rounded-lg text-sm transition-colors duration-200">
        Clear All Filters
      </button>
    </aside>
  `
})
export class ProductFilterComponent {
    brands = input<Brand[]>([]);
    categories = input<Category[]>([]);

    // Signal for internal filter state
    filters = signal<ProductFilter>({});

    // Output event
    filtersChanged = output<ProductFilter>();

    activeFilterCount = computed(() => {
        const f = this.filters();
        let count = 0;
        if (f.brand_id) count++;
        if (f.category_id) count++;
        if (f.oem_code) count++;
        if (f.in_stock) count++;
        if (f.search) count++;
        return count;
    });

    updateFilter(key: keyof ProductFilter, value: any): void {
        this.filters.update(f => ({ ...f, [key]: value || undefined }));
        this.emitChanges();
    }

    toggleBrand(brandId: string): void {
        const currentBrand = this.filters().brand_id;
        this.filters.update(f => ({
            ...f,
            brand_id: currentBrand === brandId ? undefined : brandId
        }));
        this.emitChanges();
    }

    clearAllFilters(): void {
        this.filters.set({});
        this.emitChanges();
    }

    private emitChanges(): void {
        this.filtersChanged.emit(this.filters());
    }
}
