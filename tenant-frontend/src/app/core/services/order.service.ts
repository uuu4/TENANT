import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest, ShipmentType, PaginatedResponse } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getOrders(): Observable<PaginatedResponse<Order>> {
        return this.http.get<PaginatedResponse<Order>>(`${this.apiUrl}/orders`);
    }

    getOrder(id: string): Observable<{ data: Order }> {
        return this.http.get<{ data: Order }>(`${this.apiUrl}/orders/${id}`);
    }

    createOrder(request: CreateOrderRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/orders`, request);
    }

    getShipmentTypes(): Observable<{ data: ShipmentType[] }> {
        return this.http.get<{ data: ShipmentType[] }>(`${this.apiUrl}/shipment-types`);
    }

    // Admin endpoints
    getAllOrders(status?: string): Observable<PaginatedResponse<Order>> {
        let params = new HttpParams();
        if (status) {
            params = params.set('status', status);
        }
        return this.http.get<PaginatedResponse<Order>>(`${this.apiUrl}/admin/orders`, { params });
    }

    getPendingOrders(): Observable<{ data: Order[]; count: number }> {
        return this.http.get<{ data: Order[]; count: number }>(`${this.apiUrl}/admin/orders/pending`);
    }

    approveOrder(id: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/admin/orders/${id}/approve`, {});
    }

    updateOrderStatus(id: string, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/admin/orders/${id}/status`, { status });
    }
}
