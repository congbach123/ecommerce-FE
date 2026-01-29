'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const message = searchParams.get('message');

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <XCircle className="w-20 h-20 text-red-500 mx-auto" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-6">
          {message || 'Your payment could not be processed. Please try again.'}
        </p>

        <div className="flex gap-4 justify-center">
          {orderId && (
            <Link href={`/checkout/payment?orderId=${orderId}`}>
              <Button>Try Again</Button>
            </Link>
          )}
          <Link href="/orders">
            <Button variant="outline">View Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
