'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect based on user role
        if (user.role === 'admin') {
          router.push('/admin/products');
        } else {
          router.push('/products');
        }
      } else {
        // If not logged in, redirect to login
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading spinner while checking auth
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4 text-sm text-zinc-600">Loading...</p>
      </div>
    </div>
  );
}
