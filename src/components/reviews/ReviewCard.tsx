'use client';

import { Review } from '@/types/review';
import { StarRating } from './StarRating';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="border-b border-gray-200 py-6 last:border-b-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium">
          {review.user.first_name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900">
              {review.user.first_name} {review.user.last_name}
            </span>
            {review.is_verified && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                ✓ Verified Purchase
              </span>
            )}
          </div>

          {/* Rating and date */}
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(
                new Date(review.created_at.endsWith('Z') ? review.created_at : review.created_at + 'Z'), 
                { addSuffix: true }
              )}
            </span>
          </div>

          {/* Title */}
          {review.title && (
            <h4 className="font-medium text-gray-900 mt-3">{review.title}</h4>
          )}

          {/* Comment */}
          {review.comment && (
            <p className="text-gray-600 mt-2 whitespace-pre-line">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}
