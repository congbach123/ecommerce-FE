import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistApi } from '@/lib/api/wishlist';
import { WishlistItem } from '@/types/wishlist';
import { toast } from 'sonner';

interface WishlistState {
  // State
  items: WishlistItem[];
  productIds: string[];
  isLoading: boolean;
  
  // Actions
  fetchWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  reset: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      productIds: [],
      isLoading: false,

      // Fetch wishlist from server
      fetchWishlist: async () => {
        set({ isLoading: true });
        try {
          const response = await wishlistApi.getWishlist();
          set({
            items: response.items,
            productIds: response.items.map((item) => item.product_id),
          });
        } catch (error) {
          console.error('Failed to fetch wishlist:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Add item to wishlist
      addItem: async (productId: string) => {
        // Optimistic update
        const prevProductIds = get().productIds;
        set({ productIds: [...prevProductIds, productId] });

        try {
          const response = await wishlistApi.addToWishlist(productId);
          set({
            items: response.items,
            productIds: response.items.map((item) => item.product_id),
          });
          toast.success('Added to wishlist');
        } catch (error: any) {
          // Revert
          set({ productIds: prevProductIds });
          const message = error.response?.data?.message || 'Failed to add to wishlist';
          toast.error(message);
          throw error;
        }
      },

      // Remove item from wishlist
      removeItem: async (productId: string) => {
        const prevItems = get().items;
        const prevProductIds = get().productIds;

        // Optimistic update
        set({
          items: prevItems.filter((item) => item.product_id !== productId),
          productIds: prevProductIds.filter((id) => id !== productId),
        });

        try {
          await wishlistApi.removeFromWishlist(productId);
          toast.success('Removed from wishlist');
        } catch (error: any) {
          // Revert
          set({ items: prevItems, productIds: prevProductIds });
          const message = error.response?.data?.message || 'Failed to remove from wishlist';
          toast.error(message);
          throw error;
        }
      },

      // Check if product is in wishlist
      isInWishlist: (productId: string) => {
        return get().productIds.includes(productId);
      },

      // Move item to cart
      moveToCart: async (productId: string) => {
        const prevItems = get().items;
        const prevProductIds = get().productIds;

        // Optimistic update
        set({
          items: prevItems.filter((item) => item.product_id !== productId),
          productIds: prevProductIds.filter((id) => id !== productId),
        });

        try {
          await wishlistApi.moveToCart(productId);
          toast.success('Moved to cart');
        } catch (error: any) {
          // Revert
          set({ items: prevItems, productIds: prevProductIds });
          const message = error.response?.data?.message || 'Failed to move to cart';
          toast.error(message);
          throw error;
        }
      },

      // Clear wishlist
      clearWishlist: async () => {
        const prevItems = get().items;
        const prevProductIds = get().productIds;

        set({ items: [], productIds: [] });

        try {
          await wishlistApi.clearWishlist();
          toast.success('Wishlist cleared');
        } catch (error: any) {
          set({ items: prevItems, productIds: prevProductIds });
          toast.error('Failed to clear wishlist');
          throw error;
        }
      },

      // Reset store (on logout)
      reset: () => {
        set({ items: [], productIds: [], isLoading: false });
      },
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({
        productIds: state.productIds,
      }),
    }
  )
);
