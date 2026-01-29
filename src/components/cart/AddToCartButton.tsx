'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({ productId, disabled = false, className }: AddToCartButtonProps) {
  const { addItem, isLoading } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem(productId);
    } finally {
      setIsAdding(false);
    }
  };

  const loading = isLoading || isAdding;

  return (
    <Button
      size="lg"
      className={className}
      disabled={disabled || loading}
      onClick={handleAddToCart}
    >
      {loading ? 'Adding...' : disabled ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  );
}
