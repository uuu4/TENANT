import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services';
import { Order } from '../../../core/models';

@Component({
    selector: 'app-admin-orders',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Order Management</h1>
        <div class="flex gap-2">
          <button 
            (click)="loadOrders()"
            [class.ring-2]="!statusFilter()"
            class="btn-secondary ring-primary-500">
            All
          </button>
          <button 
            (click)="loadOrders('pending')"
            [class.ring-2]="statusFilter() === 'pending'"
            class="btn-secondary ring-primary-500">
            Pending
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      } @else {
        <div class="card overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (order of orders(); track order.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="font-medium text-gray-900">{{ order.order_number }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                    {{ order.user?.name || 'N/A' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [class]="getStatusBadgeClass(order.status)">{{ order.status_label }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    \${{ order.total | number:'1.2-2' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                    {{ order.created_at | date:'short' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    @if (order.status === 'pending') {
                      <button 
                        (click)="approveOrder(order.id)"
                        [disabled]="approvingId() === order.id"
                        class="btn-primary text-sm px-3 py-1">
                        @if (approvingId() === order.id) {
                          <span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                        } @else {
                          Approve
                        }
                      </button>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
    private orderService = inject(OrderService);

    orders = signal<Order[]>([]);
    loading = signal(true);
    approvingId = signal<string | null>(null);
    statusFilter = signal<string | null>(null);

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(status?: string): void {
        this.loading.set(true);
        this.statusFilter.set(status || null);

        this.orderService.getAllOrders(status).subscribe({
            next: (response) => {
                this.orders.set(response.data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    approveOrder(id: string): void {
        this.approvingId.set(id);

        this.orderService.approveOrder(id).subscribe({
            next: () => {
                this.approvingId.set(null);
                this.loadOrders(this.statusFilter() || undefined);
            },
            error: () => this.approvingId.set(null)
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
