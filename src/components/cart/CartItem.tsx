'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem, isLoading } = useCartStore();

  const handleIncrement = () => {
    if (item.quantity < item.product.stock_quantity) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const isMaxQuantity = item.quantity >= item.product.stock_quantity;

  return (
    <div className="flex gap-3 py-4 border-b">
      {/* Product Image */}
      <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          {item.product.image ? (
            <Image
              src={item.product.image}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Image
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.product.slug}`}
          className="text-sm font-medium hover:underline line-clamp-2"
        >
          {item.product.name}
        </Link>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold">
            ${item.price.toFixed(2)}
          </span>
          {item.product.compare_price && item.product.compare_price > item.price && (
            <span className="text-xs text-muted-foreground line-through">
              ${item.product.compare_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleDecrement}
              disabled={item.quantity <= 1 || isLoading}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleIncrement}
              disabled={isMaxQuantity || isLoading}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Stock Warning */}
        {isMaxQuantity && (
          <p className="text-xs text-orange-600 mt-1">
            Max quantity reached
          </p>
        )}
      </div>

      {/* Line Total */}
      <div className="text-right">
        <span className="text-sm font-semibold">
          ${item.line_total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
