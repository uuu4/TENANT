import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services';
import { Order, ORDER_STATUS_COLORS } from '../../../core/models';

@Component({
    selector: 'app-order-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else if (orders().length) {
        <div class="space-y-4">
          @for (order of orders(); track order.id) {
            <a [routerLink]="['/orders', order.id]" class="card p-6 block hover:shadow-lg transition-shadow">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ order.order_number }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ order.created_at | date:'medium' }}</p>
                </div>
                <span [class]="getStatusBadgeClass(order.status)">
                  {{ order.status_label }}
                </span>
              </div>
              <div class="mt-4 flex justify-between items-center">
                <span class="text-gray-600">{{ order.items?.length || 0 }} items</span>
                <span class="text-lg font-semibold text-gray-900">\${{ order.total | number:'1.2-2' }}</span>
              </div>
            </a>
          }
        </div>
      } @else {
        <div class="text-center py-16">
          <svg class="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
          <p class="text-gray-500 mb-6">Start shopping to place your first order</p>
          <a routerLink="/products" class="btn-primary">Browse Products</a>
        </div>
      }
    </div>
  `
})
export class OrderListComponent implements OnInit {
    private orderService = inject(OrderService);

    orders = signal<Order[]>([]);
    loading = signal(true);

    ngOnInit(): void {
        this.orderService.getOrders().subscribe({
            next: (response) => {
                this.orders.set(response.data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
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
