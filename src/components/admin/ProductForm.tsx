'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Product, Category } from '@/lib/api/products';
import { adminProductsApi, CreateProductData } from '@/lib/api/admin/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  compare_price: z.number().min(0).optional().or(z.literal(0)),
  cost_price: z.number().min(0).optional().or(z.literal(0)),
  sku: z.string().optional(),
  stock_quantity: z.number().min(0, 'Stock must be positive').optional().or(z.literal(0)),
  category_id: z.string().optional(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description || '',
          price: product.price,
          compare_price: product.compare_price || 0,
          cost_price: product.cost_price || 0,
          sku: product.sku || '',
          stock_quantity: product.stock_quantity,
          category_id: product.category?.id || '',
          is_featured: product.is_featured,
          is_active: product.is_active,
        }
      : {
          price: 0,
          stock_quantity: 0,
          is_featured: false,
          is_active: true,
        },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Convert empty strings to undefined for optional fields
      const submitData = {
        ...data,
        category_id: data.category_id || undefined,
        sku: data.sku || undefined,
        description: data.description || undefined,
        compare_price: data.compare_price || undefined,
        cost_price: data.cost_price || undefined,
      };

      if (product) {
        await adminProductsApi.updateProduct(product.id, submitData);
        toast.success('Product updated successfully');
      } else {
        await adminProductsApi.createProduct(submitData as CreateProductData);
        toast.success('Product created successfully');
      }
      router.push('/admin/products');
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Name */}
      <div>
        <Label htmlFor="name">Product Name *</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          {...register('description')}
          className="w-full border rounded-md p-2 min-h-[100px] bg-background"
        />
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category_id">Category</Label>
        <select id="category_id" {...register('category_id')} className="w-full border rounded-md p-2 bg-background">
          <option value="">No Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Fields */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <Label htmlFor="compare_price">Compare Price</Label>
          <Input
            id="compare_price"
            type="number"
            step="0.01"
            {...register('compare_price', { valueAsNumber: true })}
          />
        </div>

        <div>
          <Label htmlFor="cost_price">Cost Price</Label>
          <Input
            id="cost_price"
            type="number"
            step="0.01"
            {...register('cost_price', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* SKU & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register('sku')} />
        </div>

        <div>
          <Label htmlFor="stock_quantity">Stock Quantity</Label>
          <Input
            id="stock_quantity"
            type="number"
            {...register('stock_quantity', { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('is_featured')} />
          <span>Featured Product</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('is_active')} />
          <span>Active</span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
