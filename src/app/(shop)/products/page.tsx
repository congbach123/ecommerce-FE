import { productsApi, categoriesApi } from '@/lib/api/products';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductSort } from '@/components/products/ProductSort';
import { Pagination } from '@/components/products/Pagination';

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    sort?: string;
    order?: string;
    featured?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const search = await searchParams;
  const params = {
    page: parseInt(search.page || '1'),
    limit: parseInt(search.limit || '20'),
    category: search.category,
    minPrice: search.minPrice ? parseFloat(search.minPrice) : undefined,
    maxPrice: search.maxPrice ? parseFloat(search.maxPrice) : undefined,
    search: search.search,
    sort: (search.sort as any) || 'created_at',
    order: (search.order as any) || 'DESC',
    featured: search.featured === 'true' ? true : undefined,
  };

  const [productsData, categories] = await Promise.all([
    productsApi.getProducts(params),
    categoriesApi.getCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-4">
            <ProductFilters categories={categories} />
          </div>
        </aside>

        {/* Products Grid */}
        <main className="lg:col-span-3">
          {/* Sort & Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              {productsData.meta.total} products found
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
        </main>
      </div>
    </div>
  );
}
