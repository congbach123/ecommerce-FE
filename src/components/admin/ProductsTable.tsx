'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/api/products';
import { adminProductsApi } from '@/lib/api/admin/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products: initialProducts }: ProductsTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This will also delete all product images.')) return;

    setDeleting(id);
    try {
      await adminProductsApi.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">SKU</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];

            return (
              <tr key={product.id} className="border-b hover:bg-muted/50">
                <td className="p-3">
                  {primaryImage ? (
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                      <Image
                        src={primaryImage.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-xs">
                      No Image
                    </div>
                  )}
                </td>
                <td className="p-3">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    {product.category && (
                      <p className="text-sm text-muted-foreground">{product.category.name}</p>
                    )}
                  </div>
                </td>
                <td className="p-3 text-sm">{product.sku || '-'}</td>
                <td className="p-3">${Number(product.price).toFixed(2)}</td>
                <td className="p-3">
                  <Badge variant={product.stock_quantity > 0 ? 'default' : 'destructive'}>
                    {product.stock_quantity}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge variant={product.is_active ? 'default' : 'secondary'}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                    >
                      {deleting === product.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
