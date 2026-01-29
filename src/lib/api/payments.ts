import api from '../api';
import {
  StripePaymentIntent,
  VNPayPaymentUrl,
  StripeConfig,
  PaymentStatus,
} from '@/types/payment';

export const paymentsApi = {
  // Get Stripe publishable key
  getStripeConfig: async (): Promise<StripeConfig> => {
    const response = await api.get('/payments/stripe/config');
    return response.data;
  },

  // Create Stripe PaymentIntent
  createStripeIntent: async (orderId: string): Promise<StripePaymentIntent> => {
    const response = await api.post('/payments/stripe/create-intent', {
      order_id: orderId,
    });
    return response.data;
  },

  // Create VNPay payment URL
  createVNPayUrl: async (orderId: string): Promise<VNPayPaymentUrl> => {
    const response = await api.post('/payments/vnpay/create', {
      order_id: orderId,
    });
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (orderId: string): Promise<PaymentStatus> => {
    const response = await api.get(`/payments/${orderId}/status`);
    return response.data;
  },
};
