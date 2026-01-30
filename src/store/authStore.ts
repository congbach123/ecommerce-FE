import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/api/auth';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // Start as true to prevent redirect before checkAuth completes
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await authApi.login(credentials);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Show success toast
          toast.success(`Welcome back, ${user.first_name}!`);
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          // Error toast is handled by API interceptor
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { user } = await authApi.register(data);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Show success toast
          toast.success('Account created successfully! Welcome aboard!');
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Registration failed',
            isLoading: false,
          });
          // Error toast is handled by API interceptor
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
          toast.success('Logged out successfully');
        } catch (error) {
          console.error('Logout error:', error);
          // Still show success message even if API call fails
          toast.success('Logged out successfully');
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const { user } = await authApi.getMe();
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
