import { api } from '@/lib/api';
import { 
  Review, 
  ReviewStats, 
  ReviewsResponse, 
  CreateReviewDto, 
  QueryReviewsParams 
} from '@/types/review';

export const reviewsApi = {
  // Get reviews for a product
  getProductReviews: async (
    productId: string,
    params?: QueryReviewsParams
  ): Promise<ReviewsResponse> => {
    const response = await api.get(`/products/${productId}/reviews`, { params });
    return response.data;
  },

  // Get review stats for a product
  getReviewStats: async (productId: string): Promise<ReviewStats> => {
    const response = await api.get(`/products/${productId}/reviews/stats`);
    return response.data;
  },

  // Get current user's review for a product
  getMyReview: async (productId: string): Promise<Review | null> => {
    try {
      const response = await api.get(`/products/${productId}/reviews/my-review`);
      return response.data;
    } catch {
      return null;
    }
  },

  // Create a review
  createReview: async (
    productId: string,
    data: CreateReviewDto
  ): Promise<Review> => {
    const response = await api.post(`/products/${productId}/reviews`, data);
    return response.data;
  },

  // Delete own review
  deleteReview: async (reviewId: string): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },

  // Get user's reviews
  getMyReviews: async (): Promise<Review[]> => {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },
};
