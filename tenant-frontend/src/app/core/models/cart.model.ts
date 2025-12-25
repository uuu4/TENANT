export interface CartItem {
    id: string;
    product_id: string;
    product: {
        id: string;
        sku: string;
        name: string;
        price_usd: number;
        price_eur: number;
        stock_quantity: number;
        brand?: string;
    };
    quantity: number;
    unit_price: number;
    total: number;
}

export interface Cart {
    id: string;
    items: CartItem[];
    subtotal: number;
    item_count: number;
}

export interface AddToCartRequest {
    product_id: string;
    quantity?: number;
}
