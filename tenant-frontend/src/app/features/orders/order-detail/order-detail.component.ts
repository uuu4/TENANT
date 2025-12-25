import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services';
import { Order } from '../../../core/models';

@Component({
    selector: 'app-order-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else if (order()) {
        <div class="mb-6">
          <a routerLink="/orders" class="text-primary-600 hover:text-primary-700 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Orders
          </a>
        </div>

        <div class="card p-6 mb-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ order()?.order_number }}</h1>
              <p class="text-gray-500 mt-1">Placed on {{ order()?.created_at | date:'medium' }}</p>
            </div>
            <span [class]="getStatusBadgeClass(order()?.status || '')">
              {{ order()?.status_label }}
            </span>
          </div>

          @if (order()?.approved_at) {
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p class="text-green-800">
                Approved on {{ order()?.approved_at | date:'medium' }}
                @if (order()?.approved_by) {
                  by {{ order()?.approved_by }}
                }
              </p>
            </div>
          }
        </div>

        <!-- Order Items -->
        <div class="card p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          <div class="space-y-4">
            @for (item of order()?.items; track item.id) {
              <div class="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p class="font-medium text-gray-900">{{ item.product.name }}</p>
                  <p class="text-sm text-gray-500">SKU: {{ item.product.sku }}</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-600">{{ item.quantity }} × \${{ item.unit_price | number:'1.2-2' }}</p>
                  <p class="font-semibold text-gray-900">\${{ item.total_price | number:'1.2-2' }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Order Summary -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          <div class="space-y-2">
            <div class="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>\${{ order()?.subtotal | number:'1.2-2' }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>\${{ order()?.tax_amount | number:'1.2-2' }}</span>
            </div>
            @if (order()?.shipment_type) {
              <div class="flex justify-between text-gray-600">
                <span>Shipping ({{ order()?.shipment_type?.name }})</span>
                <span>\${{ order()?.shipment_type?.cost | number:'1.2-2' }}</span>
              </div>
            }
            <div class="flex justify-between font-semibold text-lg text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>\${{ order()?.total | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class OrderDetailComponent implements OnInit {
    private orderService = inject(OrderService);
    private route = inject(ActivatedRoute);

    order = signal<Order | null>(null);
    loading = signal(true);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.orderService.getOrder(id).subscribe({
                next: (response) => {
                    this.order.set(response.data);
                    this.loading.set(false);
                },
                error: () => this.loading.set(false)
            });
        }
    }

    getStatusBadgeClass(status: string): string {
        const colorMap: Record<string, string> = {
            pending: 'badge-warning',
            approved: 'badge-info',
            processing: 'badge-info',
            shipped: 'badge-info',
            delivered: 'badge-success',
            cancelled: 'badge-danger'
        };
        return colorMap[status] || 'badge-info';
    }
}
