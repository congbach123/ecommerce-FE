import { create } from 'zustand';
import { ordersApi } from '@/lib/api/orders';
import { ShippingAddressInput, Order } from '@/types/order';
import { useCartStore } from './cartStore';
import { toast } from 'sonner';

export type CheckoutStep = 'shipping' | 'review' | 'success';

interface CheckoutState {
  // State
  step: CheckoutStep;
  shippingAddress: ShippingAddressInput | null;
  paymentMethod: 'cod' | 'stripe' | 'vnpay';
  notes: string;
  order: Order | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setShippingAddress: (address: ShippingAddressInput) => void;
  setPaymentMethod: (method: 'cod' | 'stripe' | 'vnpay') => void;
  setNotes: (notes: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: CheckoutStep) => void;
  submitOrder: () => Promise<Order | null>;
  reset: () => void;
}

const initialState = {
  step: 'shipping' as CheckoutStep,
  shippingAddress: null,
  paymentMethod: 'cod' as const,
  notes: '',
  order: null,
  isLoading: false,
  error: null,
};

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  ...initialState,

  setShippingAddress: (address) => {
    set({ shippingAddress: address });
  },

  setPaymentMethod: (method) => {
    set({ paymentMethod: method });
  },

  setNotes: (notes) => {
    set({ notes });
  },

  nextStep: () => {
    const { step } = get();
    if (step === 'shipping') {
      set({ step: 'review' });
    } else if (step === 'review') {
      set({ step: 'success' });
    }
  },

  prevStep: () => {
    const { step } = get();
    if (step === 'review') {
      set({ step: 'shipping' });
    }
  },

  goToStep: (step) => {
    set({ step });
  },

  submitOrder: async () => {
    const { shippingAddress, paymentMethod, notes } = get();
    
    if (!shippingAddress) {
      toast.error('Please enter shipping address');
      return null;
    }

    set({ isLoading: true, error: null });

    try {
      const order = await ordersApi.createOrder({
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        notes: notes || undefined,
      });

      // Clear cart after successful order
      useCartStore.getState().fetchCart();

      set({
        order,
        step: 'success',
        isLoading: false,
      });

      toast.success('Order placed successfully!');
      return order;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to place order';
      set({ error: message, isLoading: false });
      toast.error(message);
      return null;
    }
  },

  reset: () => {
    set(initialState);
  },
}));
