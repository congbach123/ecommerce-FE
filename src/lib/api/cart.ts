import api from '../api';
import { Cart, AddToCartRequest, UpdateCartItemRequest } from '@/types/cart';

// Get or create session ID for guest cart
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const response = await api.get('/cart', {
      headers: { 'x-session-id': getSessionId() },
    });
    return response.data;
  },

  addToCart: async (data: AddToCartRequest): Promise<Cart> => {
    const response = await api.post('/cart/items', data, {
      headers: { 'x-session-id': getSessionId() },
    });
    return response.data;
  },

  updateCartItem: async (itemId: string, data: UpdateCartItemRequest): Promise<Cart> => {
    const response = await api.put(`/cart/items/${itemId}`, data, {
      headers: { 'x-session-id': getSessionId() },
    });
    return response.data;
  },

  removeCartItem: async (itemId: string): Promise<Cart> => {
    const response = await api.delete(`/cart/items/${itemId}`, {
      headers: { 'x-session-id': getSessionId() },
    });
    return response.data;
  },

  clearCart: async (): Promise<Cart> => {
    const response = await api.delete('/cart', {
      headers: { 'x-session-id': getSessionId() },
    });
    return response.data;
  },

  mergeCart: async (): Promise<Cart> => {
    const response = await api.post('/cart/merge', null, {
      headers: { 'x-session-id': getSessionId() },
    });
    // Clear session ID after merge
    localStorage.removeItem('cart_session_id');
    return response.data;
  },

  getSessionId,
};
