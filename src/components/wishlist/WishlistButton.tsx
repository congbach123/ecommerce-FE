'use client';

import { useState, useEffect } from 'react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function WishlistButton({ productId, size = 'md', className }: WishlistButtonProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, addItem, removeItem } = useWishlistStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by deferring wishlist state check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only check wishlist state after component has mounted on the client
  const inWishlist = isMounted && isInWishlist(productId);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      if (inWishlist) {
        await removeItem(productId);
      } else {
        await addItem(productId);
      }
    } catch {
      // Error handled in store
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'rounded-full flex items-center justify-center transition-all duration-200',
        'bg-white/90 hover:bg-white shadow-md hover:shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-gray-400',
        isLoading && 'opacity-50 cursor-not-allowed',
        sizes[size],
        className
      )}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        className={cn(
          iconSizes[size],
          'transition-colors duration-200',
          inWishlist ? 'text-red-500 fill-current' : 'text-gray-600'
        )}
        fill={inWishlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
