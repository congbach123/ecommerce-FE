import apiClient from '../../api';
import { Product } from '../products';

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku?: string;
  stock_quantity?: number;
  category_id?: string;
  is_featured?: boolean;
  is_active?: boolean;
}

export const adminProductsApi = {
  createProduct: async (data: CreateProductData): Promise<Product> => {
    const { data: product } = await apiClient.post('/products', data);
    return product;
  },

  updateProduct: async (id: string, data: Partial<CreateProductData>): Promise<Product> => {
    const { data: product } = await apiClient.patch(`/products/${id}`, data);
    return product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  uploadImage: async (
    productId: string,
    file: File,
    altText?: string,
    isPrimary?: boolean,
  ): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    if (altText) formData.append('alt_text', altText);
    if (isPrimary !== undefined) formData.append('is_primary', isPrimary.toString());

    const { data } = await apiClient.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  deleteImage: async (productId: string, imageId: string): Promise<void> => {
    await apiClient.delete(`/products/${productId}/images/${imageId}`);
  },
};

export const adminCategoriesApi = {
  createCategory: async (data: {
    name: string;
    description?: string;
    parent_id?: string;
    is_active?: boolean;
  }) => {
    const { data: category } = await apiClient.post('/categories', data);
    return category;
  },

  updateCategory: async (id: string, data: any) => {
    const { data: category } = await apiClient.patch(`/categories/${id}`, data);
    return category;
  },

  deleteCategory: async (id: string) => {
    await apiClient.delete(`/categories/${id}`);
  },
};
