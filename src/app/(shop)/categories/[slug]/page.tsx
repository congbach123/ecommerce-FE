import { notFound } from 'next/navigation';
import { categoriesApi, productsApi } from '@/lib/api/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductSort } from '@/components/products/ProductSort';
import { Pagination } from '@/components/products/Pagination';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    order?: string;
  }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  try {
    const { slug } = await params;
    const search = await searchParams;
    const category = await categoriesApi.getCategoryBySlug(slug);

    const queryParams = {
      category: slug,
      page: parseInt(search.page || '1'),
      limit: 20,
      sort: (search.sort as any) || 'created_at',
      order: (search.order as any) || 'DESC',
    };

    const productsData = await productsApi.getProducts(queryParams);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>

        {/* Sort & Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-muted-foreground">
            {productsData.meta.total} products
          </p>
          <ProductSort />
        </div>

        {/* Products */}
        <ProductGrid products={productsData.data} />

        {/* Pagination */}
        {productsData.meta.totalPages > 1 && (
          <Pagination
            currentPage={productsData.meta.page}
            totalPages={productsData.meta.totalPages}
            total={productsData.meta.total}
            limit={productsData.meta.limit}
          />
        )}
      </div>
    );
  } catch (error) {
    notFound();
  }
}
