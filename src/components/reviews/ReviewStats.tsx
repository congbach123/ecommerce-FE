'use client';

import { ReviewStats as ReviewStatsType } from '@/types/review';
import { StarRating } from './StarRating';

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export function ReviewStats({ stats }: ReviewStatsProps) {
  const total = stats.count;
  const maxCount = Math.max(...Object.values(stats.breakdown));

  return (
    <div className="flex flex-col md:flex-row gap-8 py-6">
      {/* Average Rating */}
      <div className="flex flex-col items-center justify-center">
        <div className="text-5xl font-bold text-gray-900">
          {stats.average.toFixed(1)}
        </div>
        <StarRating rating={stats.average} size="lg" className="mt-2" />
        <div className="text-sm text-gray-500 mt-1">
          {total} {total === 1 ? 'review' : 'reviews'}
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = stats.breakdown[star as keyof typeof stats.breakdown];
          const percentage = total > 0 ? (count / total) * 100 : 0;
          const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm text-gray-600">{star}</span>
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              
              {/* Progress bar */}
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              
              {/* Count and percentage */}
              <div className="w-20 text-right">
                <span className="text-sm text-gray-600">
                  {count} ({percentage.toFixed(0)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
