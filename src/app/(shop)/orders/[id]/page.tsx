'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from 'lucide-react';
import { ordersApi } from '@/lib/api/orders';
import { useAuthStore } from '@/store/authStore';
import { Order, OrderStatus } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    params.then((p) => setOrderId(p.id));
  }, [params]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    if (isAuthenticated && orderId) {
      fetchOrder();
    }
  }, [isAuthenticated, authLoading, router, orderId]);

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const data = await ordersApi.getOrder(orderId);
      setOrder(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load order');
      router.push('/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setIsCancelling(true);
    try {
      const updated = await ordersApi.cancelOrder(orderId);
      setOrder(updated);
      toast.success('Order cancelled successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p>Order not found.</p>
          <Link href="/orders">
            <Button className="mt-4">Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/orders">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{order.order_number}</h1>
            <p className="text-muted-foreground">
              Placed on{' '}
              {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <Badge className={`${statusColors[order.status]} text-sm`}>
            {order.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Items
            </h2>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex justify-between">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${Number(item.subtotal).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-white border rounded-lg p-6">
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

        {/* Right: Summary */}
        <div className="space-y-6">
          {/* Payment */}
          <div className="bg-white border rounded-lg p-6">
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
                <span className="capitalize">{order.payment_status}</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Order Summary
            </h2>
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
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${Number(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base pt-2 border-t">
                <span>Total</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {order.status === 'pending' && (
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleCancel}
              disabled={isCancelling}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </Button>
          )}

          {order.notes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium mb-1">Order Notes</p>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
