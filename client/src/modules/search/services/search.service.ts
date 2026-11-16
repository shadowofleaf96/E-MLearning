import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export interface SearchResults {
  courses: Array<{
    id: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    price: number;
    instructor: {
      firstName: string;
      lastName: string;
      avatar: string | null;
    };
    category?: {
      name: string;
    };
  }>;
  lessons: Array<{
    id: string;
    title: string;
    type: string;
    duration: number | null;
    module: {
      id: string;
      title: string;
      courseId: string;
      course: {
        title: string;
      };
    };
  }>;
  instructors: Array<{
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    _count?: {
      instructorCourses: number;
    };
  }>;
}

export const searchService = {
  async search(query: string): Promise<ApiResponse<SearchResults>> {
    const response = await api.get(ENDPOINTS.SEARCH.QUERY(query));
    return response.data;
  },
};
