import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export interface CourseReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
  };
}

export interface CourseReviewsData {
  reviews: CourseReviewItem[];
  stats: {
    total: number;
    averageRating: number;
    distribution: Record<number, number>;
  };
}

export const reviewsService = {
  async getCourseReviews(
    courseId: string
  ): Promise<ApiResponse<CourseReviewsData>> {
    const response = await api.get(ENDPOINTS.REVIEWS.COURSE(courseId));
    return response.data;
  },

  async createReview(data: {
    courseId: string;
    rating: number;
    comment?: string;
  }): Promise<ApiResponse<CourseReviewItem>> {
    const response = await api.post(ENDPOINTS.REVIEWS.CREATE, data);
    return response.data;
  },

  async updateReview(
    id: string,
    data: { rating?: number; comment?: string }
  ): Promise<ApiResponse<CourseReviewItem>> {
    const response = await api.put(ENDPOINTS.REVIEWS.UPDATE(id), data);
    return response.data;
  },

  async deleteReview(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(ENDPOINTS.REVIEWS.DELETE(id));
    return response.data;
  },
};
