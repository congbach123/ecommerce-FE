'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
}

export function CartSummary({ showCheckoutButton = true }: CartSummaryProps) {
  const { subtotal, itemCount } = useCartStore();

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold">Order Summary</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-muted-foreground">Calculated at checkout</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax</span>
          <span className="text-muted-foreground">Calculated at checkout</span>
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="flex justify-between font-semibold">
          <span>Estimated Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>

      {showCheckoutButton && (
        <Link href="/checkout" className="block">
          <Button className="w-full" size="lg" disabled={itemCount === 0}>
            Proceed to Checkout
          </Button>
        </Link>
      )}
    </div>
  );
}
