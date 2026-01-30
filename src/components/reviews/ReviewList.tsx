'use client';

import { useState, useEffect } from 'react';
import { Review, QueryReviewsParams } from '@/types/review';
import { reviewsApi } from '@/lib/api/reviews';
import { ReviewCard } from './ReviewCard';
import { Button } from '@/components/ui/button';

interface ReviewListProps {
  productId: string;
}

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<QueryReviewsParams['sort']>('newest');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await reviewsApi.getProductReviews(productId, {
        page,
        limit: 5,
        sort,
      });
      setReviews(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, page, sort]);

  if (loading && reviews.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        Loading reviews...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  return (
    <div>
      {/* Sort options */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">Customer Reviews</h3>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as QueryReviewsParams['sort']);
            setPage(1);
          }}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews list */}
      <div className="divide-y divide-gray-200">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
