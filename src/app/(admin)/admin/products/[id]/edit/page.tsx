import { notFound } from 'next/navigation';
import { productsApi, categoriesApi } from '@/lib/api/products';
import { ProductForm } from '@/components/admin/ProductForm';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  try {
    const { id } = await params;
    const [product, categories] = await Promise.all([
      productsApi.getProduct(id),
      categoriesApi.getCategories(),
    ]);

    return (
      <ProtectedRoute requireAdmin>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ProductForm product={product} categories={categories} />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Product Images</h2>
              <ImageUpload product={product} />
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  } catch (error) {
    notFound();
  }
}
