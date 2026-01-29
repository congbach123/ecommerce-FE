'use client';

import { useCheckoutStore } from '@/store/checkoutStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function OrderReview() {
  const {
    shippingAddress,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
    prevStep,
    submitOrder,
    isLoading,
  } = useCheckoutStore();
  const { items, subtotal } = useCartStore();

  const handleSubmit = async () => {
    await submitOrder();
  };

  if (!shippingAddress) {
    return (
      <div className="text-center py-8">
        <p>Please fill in your shipping address first.</p>
        <Button onClick={prevStep} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Your Order</h2>

      {/* Shipping Address Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">Shipping Address</h3>
          <Button variant="link" size="sm" onClick={prevStep}>
            Edit
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {shippingAddress.first_name} {shippingAddress.last_name}
          <br />
          {shippingAddress.address_line1}
          {shippingAddress.address_line2 && (
            <>
              <br />
              {shippingAddress.address_line2}
            </>
          )}
          <br />
          {shippingAddress.city}
          {shippingAddress.state && `, ${shippingAddress.state}`}
          {shippingAddress.postal_code && ` ${shippingAddress.postal_code}`}
          <br />
          {shippingAddress.country}
        </p>
      </div>

      {/* Order Items */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium mb-4">Order Items ({items.length})</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>${item.line_total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
        <h3 className="font-medium">Payment Method</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              className="w-4 h-4"
            />
            <div>
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-sm text-muted-foreground">
                Pay when you receive your order
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-not-allowed opacity-50">
            <input
              type="radio"
              name="payment"
              value="stripe"
              disabled
              className="w-4 h-4"
            />
            <div>
              <p className="font-medium">Credit Card (Stripe)</p>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </label>
        </div>
      </div>

      {/* Order Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Order Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any special instructions for your order..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </div>
    </div>
  );
}
