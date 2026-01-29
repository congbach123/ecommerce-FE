import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartApi } from '@/lib/api/cart';
import { Cart, CartItem } from '@/types/cart';
import { toast } from 'sonner';

interface CartState {
  // State
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  isOpen: boolean;
  cartId: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeCart: () => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setCart: (cart: Cart) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      subtotal: 0,
      itemCount: 0,
      isLoading: false,
      isOpen: false,
      cartId: null,

      // Set cart data from API response
      setCart: (cart: Cart) => {
        set({
          cartId: cart.id,
          items: cart.items,
          subtotal: cart.subtotal,
          itemCount: cart.itemCount,
        });
      },

      // Fetch cart from server
      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const cart = await cartApi.getCart();
          get().setCart(cart);
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Add item to cart
      addItem: async (productId: string, quantity = 1) => {
        set({ isLoading: true });
        try {
          const cart = await cartApi.addToCart({ product_id: productId, quantity });
          get().setCart(cart);
          toast.success('Added to cart');
          set({ isOpen: true }); // Open drawer on add
        } catch (error: any) {
          const message = error.response?.data?.message || 'Failed to add to cart';
          toast.error(message);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Update item quantity
      updateQuantity: async (itemId: string, quantity: number) => {
        const previousItems = get().items;
        
        // Optimistic update
        set({
          items: previousItems.map((item) =>
            item.id === itemId
              ? { ...item, quantity, line_total: item.price * quantity }
              : item
          ),
        });

        try {
          const cart = await cartApi.updateCartItem(itemId, { quantity });
          get().setCart(cart);
        } catch (error: any) {
          // Revert on error
          set({ items: previousItems });
          const message = error.response?.data?.message || 'Failed to update quantity';
          toast.error(message);
          throw error;
        }
      },

      // Remove item from cart
      removeItem: async (itemId: string) => {
        const previousItems = get().items;
        
        // Optimistic update
        set({
          items: previousItems.filter((item) => item.id !== itemId),
          itemCount: get().itemCount - (previousItems.find((i) => i.id === itemId)?.quantity || 0),
        });

        try {
          const cart = await cartApi.removeCartItem(itemId);
          get().setCart(cart);
          toast.success('Item removed from cart');
        } catch (error: any) {
          // Revert on error
          set({ items: previousItems });
          const message = error.response?.data?.message || 'Failed to remove item';
          toast.error(message);
          throw error;
        }
      },

      // Clear entire cart
      clearCart: async () => {
        const previousItems = get().items;
        
        // Optimistic update
        set({ items: [], subtotal: 0, itemCount: 0 });

        try {
          const cart = await cartApi.clearCart();
          get().setCart(cart);
          toast.success('Cart cleared');
        } catch (error: any) {
          // Revert on error
          set({ items: previousItems });
          const message = error.response?.data?.message || 'Failed to clear cart';
          toast.error(message);
          throw error;
        }
      },

      // Merge guest cart with user cart on login
      mergeCart: async () => {
        try {
          const cart = await cartApi.mergeCart();
          get().setCart(cart);
        } catch (error) {
          console.error('Failed to merge cart:', error);
        }
      },

      // Drawer controls
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        subtotal: state.subtotal,
        itemCount: state.itemCount,
        cartId: state.cartId,
      }),
    }
  )
);
