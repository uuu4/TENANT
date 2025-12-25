import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Product, ProductFilter, PaginatedResponse, Brand, Category } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly apiUrl = environment.apiUrl;

    // Signals for caching
    private brandsSignal = signal<Brand[]>([]);
    private categoriesSignal = signal<Category[]>([]);

    readonly brands = this.brandsSignal.asReadonly();
    readonly categories = this.categoriesSignal.asReadonly();

    constructor(private http: HttpClient) { }

    getProducts(filter: ProductFilter = {}): Observable<PaginatedResponse<Product>> {
        let params = new HttpParams();

        if (filter.brand_id) params = params.set('brand_id', filter.brand_id);
        if (filter.category_id) params = params.set('category_id', filter.category_id);
        if (filter.oem_code) params = params.set('oem_code', filter.oem_code);
        if (filter.in_stock !== undefined) params = params.set('in_stock', filter.in_stock.toString());
        if (filter.search) params = params.set('search', filter.search);
        if (filter.sort_by) params = params.set('sort_by', filter.sort_by);
        if (filter.sort_order) params = params.set('sort_order', filter.sort_order);
        if (filter.page) params = params.set('page', filter.page.toString());
        if (filter.per_page) params = params.set('per_page', filter.per_page.toString());

        return this.http.get<PaginatedResponse<Product>>(`${this.apiUrl}/products`, { params });
    }

    getProduct(id: string): Observable<{ data: Product }> {
        return this.http.get<{ data: Product }>(`${this.apiUrl}/products/${id}`);
    }

    getBrands(): Observable<{ data: Brand[] }> {
        return this.http.get<{ data: Brand[] }>(`${this.apiUrl}/brands`).pipe(
            tap(response => this.brandsSignal.set(response.data))
        );
    }

    getCategories(): Observable<{ data: Category[] }> {
        return this.http.get<{ data: Category[] }>(`${this.apiUrl}/categories`).pipe(
            tap(response => this.categoriesSignal.set(response.data))
        );
    }
}
