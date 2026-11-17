import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export interface LearningPathCourseItem {
  id: string;
  learningPathId: string;
  courseId: string;
  orderIndex: number;
  course: {
    id: string;
    title: string;
    thumbnail?: string;
    price: number;
    description?: string;
    isPublished: boolean;
  };
}

export interface LearningPathProgressDetail {
  learningPathId: string;
  title: string;
  totalCourses: number;
  completedCourses: number;
  progressPercentage: number;
  isCompleted: boolean;
  courses: {
    courseId: string;
    title: string;
    orderIndex: number;
    isEnrolled: boolean;
    isCompleted: boolean;
    progressPercentage: number;
  }[];
}

export interface LearningPath {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price: number;
  isPublished: boolean;
  instructorId: string;
  createdAt: string;
  updatedAt: string;
  instructor?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  courses?: LearningPathCourseItem[];
  _count?: {
    enrollments: number;
  };
  isEnrolled?: boolean;
  progressPercentage?: number;
  completedCourses?: number;
  totalCourses?: number;
  progress?: LearningPathProgressDetail;
}

export interface CreateLearningPathPayload {
  title: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  isPublished?: boolean;
  courseIds?: string[];
}

export const learningPathsService = {
  async getPaths(
    params?: Record<string, any>
  ): Promise<ApiResponse<LearningPath[]>> {
    const res = await api.get(ENDPOINTS.LEARNING_PATHS.LIST, { params });
    return res.data;
  },

  async getEnrolledPaths(): Promise<ApiResponse<LearningPath[]>> {
    const res = await api.get(ENDPOINTS.LEARNING_PATHS.ENROLLED);
    return res.data;
  },

  async getInstructorPaths(): Promise<ApiResponse<LearningPath[]>> {
    const res = await api.get(ENDPOINTS.LEARNING_PATHS.INSTRUCTOR);
    return res.data;
  },

  async getPathById(id: string): Promise<ApiResponse<LearningPath>> {
    const res = await api.get(ENDPOINTS.LEARNING_PATHS.DETAIL(id));
    return res.data;
  },

  async createPath(
    data: CreateLearningPathPayload
  ): Promise<ApiResponse<LearningPath>> {
    const res = await api.post(ENDPOINTS.LEARNING_PATHS.CREATE, data);
    return res.data;
  },

  async updatePath(
    id: string,
    data: Partial<CreateLearningPathPayload>
  ): Promise<ApiResponse<LearningPath>> {
    const res = await api.put(ENDPOINTS.LEARNING_PATHS.UPDATE(id), data);
    return res.data;
  },

  async deletePath(id: string): Promise<ApiResponse<{ message: string }>> {
    const res = await api.delete(ENDPOINTS.LEARNING_PATHS.DELETE(id));
    return res.data;
  },

  async enrollPath(
    id: string
  ): Promise<ApiResponse<{ message: string; enrollment: any }>> {
    const res = await api.post(ENDPOINTS.LEARNING_PATHS.ENROLL(id));
    return res.data;
  },
};
