export type OrderStatus = 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    id: string;
    product: {
        id: string;
        sku: string;
        name: string;
        brand?: string;
    };
    quantity: number;
    unit_price: number;
    total_price: number;
}

export interface ShipmentType {
    id: string;
    name: string;
    code: string;
    base_cost: number;
}

export interface Order {
    id: string;
    order_number: string;
    status: OrderStatus;
    status_label: string;
    subtotal: number;
    tax_amount: number;
    total: number;
    notes?: string;
    shipment_type?: {
        id: string;
        name: string;
        cost: number;
    };
    items: OrderItem[];
    user?: {
        id: string;
        name: string;
        email: string;
    };
    approved_at?: string;
    approved_by?: string;
    created_at: string;
}

export interface CreateOrderRequest {
    shipment_type_id?: string;
    notes?: string;
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    pending: 'warning',
    approved: 'info',
    processing: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger'
};
