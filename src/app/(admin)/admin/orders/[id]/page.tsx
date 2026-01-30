'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, MapPin, CreditCard, User } from 'lucide-react';
import { adminApi } from '@/lib/api/admin';
import { Order, OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const statusOptions: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (id: string) => {
    setIsLoading(true);
    try {
      // Use admin orders endpoint - doesn't filter by user_id
      const response = await adminApi.getOrder(id);
      setOrder(response);
    } catch (error) {
      toast.error('Failed to load order');
      router.push('/admin/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    try {
      await adminApi.updateOrderStatus(order.id, newStatus);
      setOrder({ ...order, status: newStatus as OrderStatus });
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p>Order not found</p>
        <Link href="/admin/orders">
          <Button className="mt-4">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{order.order_number}</h1>
            <Badge className={statusColors[order.status]}>{order.status}</Badge>
          </div>
          <p className="text-muted-foreground">
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <div>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items ({order.items?.length || 0})
            </h2>
            <div className="divide-y">
              {order.items?.map((item) => (
                <div key={item.id} className="py-4 flex justify-between">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">${Number(item.subtotal).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </h2>
              <p className="text-muted-foreground">
                {order.shipping_address.first_name} {order.shipping_address.last_name}
                <br />
                {order.shipping_address.address_line1}
                {order.shipping_address.address_line2 && (
                  <>
                    <br />
                    {order.shipping_address.address_line2}
                  </>
                )}
                <br />
                {order.shipping_address.city}
                {order.shipping_address.state && `, ${order.shipping_address.state}`}
                {order.shipping_address.postal_code && ` ${order.shipping_address.postal_code}`}
                <br />
                {order.shipping_address.country}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer
            </h2>
            <p className="font-medium">
              {order.user?.first_name} {order.user?.last_name}
            </p>
            <p className="text-sm text-muted-foreground">{order.user?.email}</p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span className="capitalize">{order.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={
                    order.payment_status === 'paid' ? 'default' : 'secondary'
                  }
                >
                  {order.payment_status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {Number(order.shipping_fee) === 0
                    ? 'Free'
                    : `$${Number(order.shipping_fee).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>${Number(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t">
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
