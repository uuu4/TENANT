export interface Brand {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id?: string;
    children?: Category[];
}

export interface Product {
    id: string;
    sku: string;
    oem_code?: string;
    name: string;
    description?: string;
    price_usd: number;
    price_eur: number;
    stock_quantity: number;
    is_in_stock: boolean;
    stock_synced_at?: string;
    brand?: {
        id: string;
        name: string;
        logo_url?: string;
    };
    category?: {
        id: string;
        name: string;
    };
}

export interface ProductFilter {
    brand_id?: string;
    category_id?: string;
    oem_code?: string;
    in_stock?: boolean;
    search?: string;
    sort_by?: 'name' | 'price_usd' | 'price_eur' | 'stock_quantity' | 'created_at';
    sort_order?: 'asc' | 'desc';
    page?: number;
    per_page?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
