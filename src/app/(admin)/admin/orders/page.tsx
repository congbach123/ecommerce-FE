'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, MoreVertical } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { Order, OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const statusOptions: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await adminApi.getOrders({
        page,
        limit: 20,
        status: statusFilter || undefined,
      });
      setOrders(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.order_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by order number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Order
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Customer
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Total
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Payment
              </th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium">{order.order_number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">
                        {order.user?.first_name} {order.user?.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.user?.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        order.payment_status === 'paid' ? 'default' : 'secondary'
                      }
                    >
                      {order.payment_status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-sm px-2 py-1 rounded-full border-0 ${statusColors[order.status]}`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
