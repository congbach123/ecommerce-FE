'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';

export default function CartPage() {
  const { items, fetchCart, clearCart, isLoading } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
        </div>

        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCart}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        )}
      </div>

      {isLoading && items.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-xl font-semibold mb-3">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet.
            Start shopping to fill it up!
          </p>
          <Link href="/products">
            <Button size="lg">Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-4">
              <div className="text-sm text-muted-foreground mb-4">
                {items.length} {items.length === 1 ? 'item' : 'items'} in cart
              </div>
              
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary />
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>Free shipping on orders over $100</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
