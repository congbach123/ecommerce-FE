'use client';

import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface StripePaymentFormProps {
  orderId: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function StripePaymentForm({
  orderId,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) return;

    // Check for payment result on return
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case 'succeeded':
          setMessage('Payment succeeded!');
          onSuccess();
          break;
        case 'processing':
          setMessage('Your payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Your payment was not successful, please try again.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/payment/success?orderId=${orderId}`,
      },
    });

    // Error will only reach here if immediate error (like card declined)
    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'Payment failed');
        toast.error(error.message || 'Payment failed');
      } else {
        setMessage('An unexpected error occurred.');
        toast.error('An unexpected error occurred.');
      }
      onError(error.message || 'Payment failed');
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {message && (
        <div className="text-sm text-muted-foreground text-center">
          {message}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Your payment is processed securely by Stripe
      </p>
    </form>
  );
}
