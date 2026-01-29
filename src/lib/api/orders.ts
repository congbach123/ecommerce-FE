import api from '../api';
import {
  Order,
  OrdersResponse,
  CreateOrderRequest,
  QueryOrderParams,
} from '@/types/order';

export const ordersApi = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getOrders: async (params?: QueryOrderParams): Promise<OrdersResponse> => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },
};
