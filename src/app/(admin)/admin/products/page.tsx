import Link from 'next/link';
import { productsApi } from '@/lib/api/products';
import { Button } from '@/components/ui/button';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default async function AdminProductsPage() {
  const { data: products } = await productsApi.getProducts({ limit: 100 });

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products Management</h1>
          <Link href="/admin/products/new">
            <Button>Add New Product</Button>
          </Link>
        </div>

        <ProductsTable products={products} />
      </div>
    </ProtectedRoute>
  );
}
