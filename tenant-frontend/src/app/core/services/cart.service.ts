import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart, CartItem, AddToCartRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly apiUrl = `${environment.apiUrl}/cart`;

    // Signals for reactive cart state
    private cartSignal = signal<Cart | null>(null);
    private loadingSignal = signal<boolean>(false);

    readonly cart = this.cartSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly itemCount = computed(() => this.cartSignal()?.item_count ?? 0);
    readonly subtotal = computed(() => this.cartSignal()?.subtotal ?? 0);
    readonly isEmpty = computed(() => this.itemCount() === 0);

    constructor(private http: HttpClient) { }

    loadCart(): Observable<{ data: Cart }> {
        this.loadingSignal.set(true);

        return this.http.get<{ data: Cart }>(this.apiUrl).pipe(
            tap(response => {
                this.cartSignal.set(response.data);
                this.loadingSignal.set(false);
            })
        );
    }

    addItem(request: AddToCartRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/items`, request).pipe(
            tap(() => this.loadCart().subscribe())
        );
    }

    updateQuantity(productId: string, quantity: number): Observable<any> {
        return this.http.put(`${this.apiUrl}/items/${productId}`, { quantity }).pipe(
            tap(() => this.loadCart().subscribe())
        );
    }

    removeItem(productId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/items/${productId}`).pipe(
            tap(() => this.loadCart().subscribe())
        );
    }

    clearCart(): Observable<any> {
        return this.http.delete(this.apiUrl).pipe(
            tap(() => this.cartSignal.set(null))
        );
    }

    // Helper to check if product is in cart
    getCartItem(productId: string): CartItem | undefined {
        return this.cartSignal()?.items.find(item => item.product_id === productId);
    }

    isInCart(productId: string): boolean {
        return this.getCartItem(productId) !== undefined;
    }
}
