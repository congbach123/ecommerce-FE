'use client';

import { useState, useEffect } from 'react';
import { reviewsApi } from '@/lib/api/reviews';
import { ReviewStats as ReviewStatsType } from '@/types/review';
import { ReviewStats } from './ReviewStats';
import { ReviewList } from './ReviewList';
import { ReviewForm } from './ReviewForm';

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [stats, setStats] = useState<ReviewStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchStats = async () => {
    try {
      const data = await reviewsApi.getReviewStats(productId);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch review stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [productId, refreshKey]);

  const handleReviewSubmitted = () => {
    setRefreshKey((k) => k + 1);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Stats */}
      {stats && <ReviewStats stats={stats} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Review List */}
        <div className="lg:col-span-2">
          <ReviewList key={refreshKey} productId={productId} />
        </div>

        {/* Review Form */}
        <div>
          <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
        </div>
      </div>
    </div>
  );
}
