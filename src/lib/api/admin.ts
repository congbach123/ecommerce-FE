import api from '../api';
import {
  DashboardStats,
  RevenueDataPoint,
  TopProduct,
  AdminUsersResponse,
} from '@/types/admin';
import { Order } from '@/types/order';
import { Product } from '@/types/product';

export const adminApi = {
  // ===== Dashboard =====
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getRevenueChart: async (days?: number): Promise<RevenueDataPoint[]> => {
    const response = await api.get('/admin/dashboard/revenue', {
      params: { days },
    });
    return response.data;
  },

  getRecentOrders: async (limit?: number): Promise<Order[]> => {
    const response = await api.get('/admin/dashboard/recent-orders', {
      params: { limit },
    });
    return response.data;
  },

  getLowStockProducts: async (threshold?: number): Promise<Product[]> => {
    const response = await api.get('/admin/dashboard/low-stock', {
      params: { threshold },
    });
    return response.data;
  },

  getTopProducts: async (limit?: number): Promise<TopProduct[]> => {
    const response = await api.get('/admin/dashboard/top-products', {
      params: { limit },
    });
    return response.data;
  },

  // ===== Users =====
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<AdminUsersResponse> => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUserRole: async (id: string, role: 'admin' | 'customer') => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  updateUserStatus: async (id: string, is_active: boolean) => {
    const response = await api.put(`/admin/users/${id}/status`, { is_active });
    return response.data;
  },

  // ===== Orders (using existing admin endpoints) =====
  getOrders: async (params?: any) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (
    id: string,
    status: string,
    payment_status?: string
  ) => {
    const response = await api.put(`/admin/orders/${id}/status`, {
      status,
      payment_status,
    });
    return response.data;
  },
};
