'use client';

import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

export function CartButton() {
  const { itemCount, toggleDrawer } = useCartStore();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="relative"
      onClick={toggleDrawer}
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-black text-white text-xs flex items-center justify-center font-medium animate-in zoom-in-50 duration-200">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Button>
  );
}
