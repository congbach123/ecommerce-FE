'use client';

import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { Button } from '@/components/ui/button';

interface ProductWishlistButtonProps {
  productId: string;
}

export function ProductWishlistButton({ productId }: ProductWishlistButtonProps) {
  return (
    <div className="flex items-center gap-3">
      <WishlistButton productId={productId} size="lg" className="!rounded-md border border-gray-300 !bg-white hover:!bg-gray-50" />
      <span className="text-sm text-gray-600">Add to Wishlist</span>
    </div>
  );
}
