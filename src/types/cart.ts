// Cart item from API response
export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price: number | null;
  stock_quantity: number;
  image: string | null;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: CartItemProduct;
  quantity: number;
  price: number;
  line_total: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// DTOs for API requests
export interface AddToCartRequest {
  product_id: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
