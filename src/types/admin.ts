// Dashboard statistics
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  pendingOrders: number;
  lowStockProducts: number;
}

// Revenue chart data point
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

// Top product
export interface TopProduct {
  productId: string;
  productName: string;
  totalSold: number;
  totalRevenue: number;
}

// Admin user list item
export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'customer';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Paginated users response
export interface AdminUsersResponse {
  data: AdminUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
