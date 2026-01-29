'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';

export function CartDrawer() {
  const { items, isOpen, closeDrawer, fetchCart, isLoading } = useCartStore();

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeDrawer]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <Button variant="ghost" size="icon" onClick={closeDrawer}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading && items.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added anything to your cart yet.
                </p>
                <Link href="/products" onClick={closeDrawer}>
                  <Button>Continue Shopping</Button>
                </Link>
              </div>
            ) : (
              <div>
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-3">
              <CartSummary showCheckoutButton={false} />
              
              <div className="grid grid-cols-2 gap-3">
                <Link href="/cart" onClick={closeDrawer}>
                  <Button variant="outline" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={closeDrawer}>
                  <Button className="w-full">
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
