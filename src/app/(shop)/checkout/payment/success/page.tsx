'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { paymentsApi } from '@/lib/api/payments';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      paymentsApi.getPaymentStatus(orderId)
        .then((status) => {
          setOrderNumber(status.orderNumber);
        })
        .catch(console.error);
    }
  }, [orderId]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-in zoom-in duration-300" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your payment. Your order is now being processed.
        </p>

        {orderNumber && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="font-semibold text-lg">{orderNumber}</p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          {orderId && (
            <Link href={`/orders/${orderId}`}>
              <Button>View Order</Button>
            </Link>
          )}
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
