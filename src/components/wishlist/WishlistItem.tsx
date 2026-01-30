'use client';

import Image from 'next/image';
import Link from 'next/link';
import { WishlistItem as WishlistItemType } from '@/types/wishlist';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface WishlistItemProps {
  item: WishlistItemType;
}

export function WishlistItem({ item }: WishlistItemProps) {
  const { removeItem, moveToCart } = useWishlistStore();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const { product } = item;
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const isOutOfStock = product.stock_quantity === 0;

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeItem(product.id);
    } catch {
      // Error handled in store
    } finally {
      setIsRemoving(false);
    }
  };

  const handleMoveToCart = async () => {
    if (isOutOfStock) return;
    
    setIsMoving(true);
    try {
      await moveToCart(product.id);
    } catch {
      // Error handled in store
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <div className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white">
      {/* Product Image */}
      <Link href={`/products/${product.slug}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-medium">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-gray-900 hover:underline line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold text-gray-900">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.compare_price && Number(product.compare_price) > Number(product.price) && (
            <span className="text-sm text-gray-500 line-through">
              ${Number(product.compare_price).toFixed(2)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleMoveToCart}
            disabled={isMoving || isOutOfStock}
            className="bg-gray-900 hover:bg-gray-800"
          >
            {isMoving ? 'Moving...' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </Button>
        </div>
      </div>
    </div>
  );
}
