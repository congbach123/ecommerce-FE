export interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified: boolean;
  created_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface ReviewStats {
  average: number;
  count: number;
  breakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface ReviewsResponse {
  data: Review[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateReviewDto {
  rating: number;
  title?: string;
  comment?: string;
  order_id?: string;
}

export interface QueryReviewsParams {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest';
  min_rating?: number;
}
