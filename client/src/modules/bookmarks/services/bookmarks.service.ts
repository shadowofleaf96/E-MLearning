import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export const bookmarksService = {
  async getBookmarks(): Promise<ApiResponse<any[]>> {
    const response = await api.get(ENDPOINTS.BOOKMARKS.LIST);
    return response.data;
  },

  async toggleBookmark(courseId: string): Promise<ApiResponse<{ bookmarked: boolean }>> {
    const response = await api.post(ENDPOINTS.BOOKMARKS.TOGGLE(courseId));
    return response.data;
  },

  async checkBookmark(courseId: string): Promise<ApiResponse<{ bookmarked: boolean }>> {
    const response = await api.get(ENDPOINTS.BOOKMARKS.CHECK(courseId));
    return response.data;
  },
};
