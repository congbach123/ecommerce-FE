import axios from 'axios';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies if needed
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (will implement in auth store later)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Only show toast on client side
    if (typeof window !== 'undefined') {
      // Extract error message
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An error occurred';

      // Handle different error status codes
      if (error.response?.status === 401) {
        toast.error('Unauthorized - Please login again');
        localStorage.removeItem('token');
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (error.response?.status === 403) {
        toast.error('Access forbidden - Insufficient permissions');
      } else if (error.response?.status === 404) {
        toast.error('Resource not found');
      } else if (error.response?.status === 422) {
        // Validation errors
        toast.error(errorMessage);
      } else if (error.response?.status >= 500) {
        toast.error('Server error - Please try again later');
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Network error - Please check your connection');
      } else {
        // Show the specific error message from backend
        toast.error(errorMessage);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
