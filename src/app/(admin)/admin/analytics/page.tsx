'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { DashboardStats, RevenueDataPoint, TopProduct } from '@/types/admin';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { StatCard } from '@/components/admin/StatCard';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [statsData, revenue, top] = await Promise.all([
        adminApi.getStats(),
        adminApi.getRevenueChart(selectedPeriod),
        adminApi.getTopProducts(10),
      ]);
      setStats(statsData);
      setRevenueData(revenue);
      setTopProducts(top);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total revenue for the period
  const periodRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const periodOrders = revenueData.reduce((sum, d) => sum + d.orders, 0);
  const avgDailyRevenue = revenueData.length > 0 ? periodRevenue / revenueData.length : 0;
  const avgDailyOrders = revenueData.length > 0 ? periodOrders / revenueData.length : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground">
            Detailed insights into your store performance
          </p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(Number(e.target.value))}
          className="border rounded-lg px-4 py-2 text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Period Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={`Revenue (${selectedPeriod} days)`}
          value={`$${periodRevenue.toFixed(2)}`}
          icon={DollarSign}
          iconColor="text-green-600"
        />
        <StatCard
          title={`Orders (${selectedPeriod} days)`}
          value={periodOrders}
          icon={ShoppingCart}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Avg Daily Revenue"
          value={`$${avgDailyRevenue.toFixed(2)}`}
          icon={TrendingUp}
          iconColor="text-purple-600"
        />
        <StatCard
          title="Avg Daily Orders"
          value={avgDailyOrders.toFixed(1)}
          icon={Package}
          iconColor="text-orange-600"
        />
      </div>

      {/* Revenue Chart - Full Width */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Revenue Trend</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-muted-foreground">Orders</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <RevenueChart data={revenueData} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-muted-foreground">Rank</th>
                  <th className="text-left py-3 font-medium text-muted-foreground">Product</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">Units Sold</th>
                  <th className="text-right py-3 font-medium text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length > 0 ? (
                  topProducts.map((product, index) => (
                    <tr key={product.productId} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-50 text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 font-medium truncate max-w-[200px]">
                        {product.productName}
                      </td>
                      <td className="py-3 text-right">{product.totalSold}</td>
                      <td className="py-3 text-right font-medium">
                        ${product.totalRevenue.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      No sales data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Store Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue (All Time)</p>
                  <p className="font-semibold">${(stats?.totalRevenue || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders (All Time)</p>
                  <p className="font-semibold">{stats?.totalOrders || 0}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="font-semibold">{stats?.totalCustomers || 0}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Order Value</p>
                  <p className="font-semibold">${(stats?.averageOrderValue || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <p className="font-semibold">{stats?.pendingOrders || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
