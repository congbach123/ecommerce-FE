import { categoriesApi } from '@/lib/api/products';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default async function NewProductPage() {
  const categories = await categoriesApi.getCategories();

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create New Product</h1>
        <ProductForm categories={categories} />
      </div>
    </ProtectedRoute>
  );
}
