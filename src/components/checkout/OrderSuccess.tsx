'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkoutStore';
import { Button } from '@/components/ui/button';

export function OrderSuccess() {
  const { order, reset } = useCheckoutStore();

  if (!order) {
    return (
      <div className="text-center py-8">
        <p>No order found.</p>
        <Link href="/products">
          <Button className="mt-4">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <div className="mb-6">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-in zoom-in duration-300" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Thank You for Your Order!</h2>
      <p className="text-muted-foreground mb-6">
        Your order has been placed successfully.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8">
        <div className="space-y-3 text-left">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Number</span>
            <span className="font-medium">{order.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium">${Number(order.total).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-medium capitalize">{order.payment_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium capitalize">{order.status}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-8">
        A confirmation email has been sent to your email address.
      </p>

      <div className="flex gap-4 justify-center">
        <Link href={`/orders/${order.id}`}>
          <Button onClick={reset}>View Order</Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" onClick={reset}>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
