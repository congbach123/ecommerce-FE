export interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_price?: number;
    stock_quantity: number;
    is_active: boolean;
    images?: Array<{
      id: string;
      image_url: string;
      is_primary: boolean;
    }>;
  };
}

export interface WishlistResponse {
  items: WishlistItem[];
  count: number;
}
