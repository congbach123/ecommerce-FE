import axios from 'axios';
import type { User, LoginCredentials, RegisterData } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance with credentials enabled for cookies
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ user: User }> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<{ user: User }> {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getMe(): Promise<{ user: User }> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, new_password: string): Promise<{ message: string }> {
    const response = await apiClient.post('/auth/reset-password', { token, new_password });
    return response.data;
  },
};
