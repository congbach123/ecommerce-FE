import { api } from '@/lib/api';
import { WishlistResponse } from '@/types/wishlist';

export const wishlistApi = {
  // Get user's wishlist
  getWishlist: async (): Promise<WishlistResponse> => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Get wishlist product IDs for quick checks
  getProductIds: async (): Promise<string[]> => {
    const response = await api.get('/wishlist/product-ids');
    return response.data;
  },

  // Check if product is in wishlist
  isInWishlist: async (productId: string): Promise<boolean> => {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  },

  // Add product to wishlist
  addToWishlist: async (productId: string): Promise<WishlistResponse> => {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data;
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId: string): Promise<void> => {
    await api.delete(`/wishlist/${productId}`);
  },

  // Move item to cart
  moveToCart: async (productId: string, sessionId?: string): Promise<void> => {
    await api.post(`/wishlist/${productId}/move-to-cart`, null, {
      params: sessionId ? { session_id: sessionId } : undefined,
    });
  },

  // Clear wishlist
  clearWishlist: async (): Promise<void> => {
    await api.delete('/wishlist');
  },
};
