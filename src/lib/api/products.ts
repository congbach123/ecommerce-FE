import apiClient from '../api';

export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku?: string;
  stock_quantity: number;
  category?: Category;
  category_id?: string;
  is_featured: boolean;
  is_active: boolean;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'price' | 'name' | 'created_at';
  order?: 'ASC' | 'DESC';
  featured?: boolean;
}

export const productsApi = {
  getProducts: async (params?: ProductQueryParams): Promise<ProductsResponse> => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/slug/${slug}`);
    return data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    const { data } = await apiClient.get('/products', {
      params: { featured: true, limit: 8 },
    });
    return data.data;
  },
};

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get('/categories');
    return data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const { data } = await apiClient.get(`/categories/${id}`);
    return data;
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const { data } = await apiClient.get(`/categories/slug/${slug}`);
    return data;
  },
};
