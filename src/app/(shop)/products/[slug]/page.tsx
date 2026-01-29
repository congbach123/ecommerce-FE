import { notFound } from 'next/navigation';
import Link from 'next/link';
import { productsApi } from '@/lib/api/products';
import { ProductGallery } from '@/components/products/ProductGallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/cart/AddToCartButton';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  try {
    const { slug } = await params;
    const product = await productsApi.getProductBySlug(slug);

    const price = Number(product.price);
    const comparePrice = product.compare_price ? Number(product.compare_price) : null;
    const hasDiscount = comparePrice && comparePrice > price;
    const discountPercent = hasDiscount
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : 0;

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/categories/${product.category.slug}`} className="hover:underline">
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Images */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.is_featured && <Badge>Featured</Badge>}
              {hasDiscount && <Badge variant="destructive">-{discountPercent}% OFF</Badge>}
              {product.stock_quantity === 0 && <Badge variant="secondary">Out of Stock</Badge>}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {/* SKU */}
            {product.sku && (
              <p className="text-sm text-muted-foreground mb-4">SKU: {product.sku}</p>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-bold">${price.toFixed(2)}</span>
              {hasDiscount && comparePrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock_quantity > 0 ? (
                <p className="text-sm text-green-600">
                  In Stock ({product.stock_quantity} available)
                </p>
              ) : (
                <p className="text-sm text-red-600">Out of Stock</p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <AddToCartButton
                productId={product.id}
                disabled={product.stock_quantity === 0}
                className="w-full"
              />
              <Button size="lg" variant="outline" className="w-full">
                Add to Wishlist
              </Button>
            </div>

            {/* Category */}
            {product.category && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Category:{' '}
                  <Link
                    href={`/categories/${product.category.slug}`}
                    className="text-foreground hover:underline"
                  >
                    {product.category.name}
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
