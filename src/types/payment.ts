// Stripe PaymentIntent response
export interface StripePaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

// VNPay payment URL response
export interface VNPayPaymentUrl {
  paymentUrl: string;
  orderNumber: string;
}

// Stripe config
export interface StripeConfig {
  publishableKey: string;
}

// Payment status
export interface PaymentStatus {
  orderId: string;
  orderNumber: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  total: number;
}
