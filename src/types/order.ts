// Order status enums
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Shipping address for order creation
export interface ShippingAddressInput {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
}

// Request to create an order
export interface CreateOrderRequest {
  shipping_address: ShippingAddressInput;
  payment_method?: 'cod' | 'stripe' | 'vnpay';
  notes?: string;
}

// Order item in response
export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Shipping address in response
export interface ShippingAddress {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
}

// Full order response
export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  shipping_address?: ShippingAddress;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

// Paginated orders response
export interface OrdersResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Query parameters for listing orders
export interface QueryOrderParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  sort?: 'created_at' | 'total';
  order?: 'ASC' | 'DESC';
}
