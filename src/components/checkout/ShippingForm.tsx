'use client';

import { useForm } from 'react-hook-form';
import { useCheckoutStore } from '@/store/checkoutStore';
import { ShippingAddressInput } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ShippingForm() {
  const { shippingAddress, setShippingAddress, nextStep } = useCheckoutStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddressInput>({
    defaultValues: shippingAddress || {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
  });

  const onSubmit = (data: ShippingAddressInput) => {
    setShippingAddress(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name *</Label>
          <Input
            id="first_name"
            {...register('first_name', { required: 'First name is required' })}
            className={errors.first_name ? 'border-red-500' : ''}
          />
          {errors.first_name && (
            <p className="text-sm text-red-500">{errors.first_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name *</Label>
          <Input
            id="last_name"
            {...register('last_name', { required: 'Last name is required' })}
            className={errors.last_name ? 'border-red-500' : ''}
          />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register('phone')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_line1">Address Line 1 *</Label>
        <Input
          id="address_line1"
          {...register('address_line1', { required: 'Address is required' })}
          className={errors.address_line1 ? 'border-red-500' : ''}
        />
        {errors.address_line1 && (
          <p className="text-sm text-red-500">{errors.address_line1.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address_line2">Address Line 2</Label>
        <Input id="address_line2" {...register('address_line2')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            {...register('city', { required: 'City is required' })}
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input id="state" {...register('state')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input id="postal_code" {...register('postal_code')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country *</Label>
        <Input
          id="country"
          {...register('country', { required: 'Country is required' })}
          className={errors.country ? 'border-red-500' : ''}
        />
        {errors.country && (
          <p className="text-sm text-red-500">{errors.country.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Continue to Review
        </Button>
      </div>
    </form>
  );
}
