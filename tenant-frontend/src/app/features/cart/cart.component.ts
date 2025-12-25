import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, OrderService } from '../../core/services';
import { ShipmentType } from '../../core/models';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else if (cart()?.items?.length) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Cart Items -->
          <div class="lg:col-span-2 space-y-4">
            @for (item of cart()?.items; track item.id) {
              <div class="card p-4 flex gap-4">
                <!-- Product Image -->
                <div class="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                </div>

                <!-- Product Info -->
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ item.product.name }}</h3>
                  <p class="text-sm text-gray-500">SKU: {{ item.product.sku }}</p>
                  <p class="text-primary-600 font-medium mt-1">\${{ item.unit_price | number:'1.2-2' }}</p>
                </div>

                <!-- Quantity -->
                <div class="flex items-center gap-2">
                  <button 
                    (click)="updateQuantity(item.product_id, item.quantity - 1)"
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                    -
                  </button>
                  <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                  <button 
                    (click)="updateQuantity(item.product_id, item.quantity + 1)"
                    [disabled]="item.quantity >= item.product.stock_quantity"
                    class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center">
                    +
                  </button>
                </div>

                <!-- Total & Remove -->
                <div class="text-right">
                  <p class="font-semibold text-gray-900">\${{ item.total | number:'1.2-2' }}</p>
                  <button 
                    (click)="removeItem(item.product_id)"
                    class="text-red-500 hover:text-red-600 text-sm mt-2">
                    Remove
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Order Summary -->
          <div class="lg:col-span-1">
            <div class="card p-6 sticky top-24">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <!-- Shipping -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Shipping Method</label>
                <select [(ngModel)]="selectedShipmentType" class="input">
                  <option [ngValue]="null">Select shipping...</option>
                  @for (type of shipmentTypes(); track type.id) {
                    <option [ngValue]="type.id">{{ type.name }} (\${{ type.base_cost }})</option>
                  }
                </select>
              </div>

              <!-- Notes -->
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                <textarea 
                  [(ngModel)]="orderNotes"
                  rows="3"
                  class="input"
                  placeholder="Add notes..."></textarea>
              </div>

              <div class="border-t border-gray-200 pt-4 space-y-2">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>\${{ cart()?.subtotal | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Tax (20%)</span>
                  <span>\${{ (cart()?.subtotal || 0) * 0.2 | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between font-semibold text-lg text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>\${{ (cart()?.subtotal || 0) * 1.2 | number:'1.2-2' }}</span>
                </div>
              </div>

              <button 
                (click)="placeOrder()"
                [disabled]="placingOrder()"
                class="w-full btn-primary mt-6 py-3 disabled:opacity-50">
                @if (placingOrder()) {
                  <span class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                }
                Place Order
              </button>
            </div>
          </div>
        </div>
      } @else {
        <!-- Empty Cart -->
        <div class="text-center py-16">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 5H3m4 8v6a1 1 0 001 1h8a1 1 0 001-1v-6M9 21h6"/>
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p class="text-gray-500 mb-6">Start shopping to add items to your cart</p>
          <a routerLink="/products" class="btn-primary">Browse Products</a>
        </div>
      }
    </div>
  `
})
export class CartComponent implements OnInit {
    private cartService = inject(CartService);
    private orderService = inject(OrderService);
    private router = inject(Router);

    cart = this.cartService.cart;
    loading = this.cartService.loading;
    shipmentTypes = signal<ShipmentType[]>([]);
    placingOrder = signal(false);

    selectedShipmentType: string | null = null;
    orderNotes = '';

    ngOnInit(): void {
        this.cartService.loadCart().subscribe();
        this.orderService.getShipmentTypes().subscribe({
            next: (response) => this.shipmentTypes.set(response.data)
        });
    }

    updateQuantity(productId: string, quantity: number): void {
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }
        this.cartService.updateQuantity(productId, quantity).subscribe();
    }

    removeItem(productId: string): void {
        this.cartService.removeItem(productId).subscribe();
    }

    placeOrder(): void {
        this.placingOrder.set(true);

        this.orderService.createOrder({
            shipment_type_id: this.selectedShipmentType || undefined,
            notes: this.orderNotes || undefined
        }).subscribe({
            next: (response) => {
                this.placingOrder.set(false);
                this.router.navigate(['/orders', response.data.id]);
            },
            error: () => this.placingOrder.set(false)
        });
    }
}
