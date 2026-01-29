'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { OrderReview } from '@/components/checkout/OrderReview';
import { OrderSuccess } from '@/components/checkout/OrderSuccess';

export default function CheckoutPage() {
  const router = useRouter();
  const { step, reset } = useCheckoutStore();
  const { items, fetchCart, itemCount } = useCartStore();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Reset checkout on unmount
  useEffect(() => {
    return () => {
      // Only reset if not on success step
      if (step !== 'success') {
        reset();
      }
    };
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  // Redirect if cart is empty (except on success)
  if (step !== 'success' && itemCount === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add some items to your cart before checking out.
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Step indicator
  const steps = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'review', label: 'Review' },
    { id: 'success', label: 'Confirmation' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        {step !== 'success' && (
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        )}
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((s, index) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStepIndex
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 text-sm ${
                index <= currentStepIndex
                  ? 'text-black font-medium'
                  : 'text-gray-500'
              }`}
            >
              {s.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${
                  index < currentStepIndex ? 'bg-black' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {step === 'shipping' && <ShippingForm />}
        {step === 'review' && <OrderReview />}
        {step === 'success' && <OrderSuccess />}
      </div>
    </div>
  );
}
