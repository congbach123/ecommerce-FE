'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ArrowLeft, CreditCard, Landmark } from 'lucide-react';
import Link from 'next/link';
import { paymentsApi } from '@/lib/api/payments';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { StripePaymentForm } from '@/components/checkout/StripePaymentForm';
import { toast } from 'sonner';

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'vnpay'>('stripe');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load Stripe config
  useEffect(() => {
    const loadStripeConfig = async () => {
      try {
        const config = await paymentsApi.getStripeConfig();
        if (config.publishableKey) {
          setStripePromise(loadStripe(config.publishableKey));
        }
      } catch (err) {
        console.error('Failed to load Stripe config:', err);
      }
    };

    loadStripeConfig();
  }, []);

  // Create payment intent when order ID is available
  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setIsLoading(false);
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const intent = await paymentsApi.createStripeIntent(orderId);
        setClientSecret(intent.clientSecret);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to setup payment');
        toast.error('Failed to setup payment');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [orderId]);

  const handleVNPayPayment = async () => {
    if (!orderId) return;
    
    setIsLoading(true);
    try {
      const result = await paymentsApi.createVNPayUrl(orderId);
      // Redirect to VNPay
      window.location.href = result.paymentUrl;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create VNPay payment');
      setIsLoading(false);
    }
  };

  const handleStripeSuccess = () => {
    router.push(`/checkout/payment/success?orderId=${orderId}`);
  };

  const handleStripeError = (message: string) => {
    toast.error(message);
  };

  if (!orderId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-xl font-semibold mb-4">No Order Found</h1>
          <p className="text-muted-foreground mb-6">
            Unable to find an order to pay for.
          </p>
          <Link href="/orders">
            <Button>View My Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-xl font-semibold mb-4 text-red-600">Payment Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link href="/orders">
            <Button>View My Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/orders/${orderId}`}>
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Order
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Complete Payment</h1>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-3">Select Payment Method</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                paymentMethod === 'stripe'
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('stripe')}
            >
              <CreditCard className="h-6 w-6" />
              <span className="text-sm font-medium">Credit Card</span>
              <span className="text-xs text-muted-foreground">Stripe</span>
            </button>
            <button
              type="button"
              className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                paymentMethod === 'vnpay'
                  ? 'border-black bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('vnpay')}
            >
              <Landmark className="h-6 w-6" />
              <span className="text-sm font-medium">Bank Transfer</span>
              <span className="text-xs text-muted-foreground">VNPay</span>
            </button>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white border rounded-lg p-6">
          {paymentMethod === 'stripe' && stripePromise && clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                },
              }}
            >
              <StripePaymentForm
                orderId={orderId}
                onSuccess={handleStripeSuccess}
                onError={handleStripeError}
              />
            </Elements>
          ) : paymentMethod === 'vnpay' ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-6">
                You will be redirected to VNPay to complete your payment.
              </p>
              <Button
                onClick={handleVNPayPayment}
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Redirecting...' : 'Pay with VNPay'}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
