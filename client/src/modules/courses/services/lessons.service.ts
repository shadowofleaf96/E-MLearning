import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export const lessonsService = {
  async getLessonsByModule(moduleId: string): Promise<ApiResponse<any[]>> {
    const response = await api.get(ENDPOINTS.MODULES.LESSONS(moduleId));
    return response.data;
  },

  async createLesson(data: any): Promise<ApiResponse<any>> {
    const response = await api.post(ENDPOINTS.LESSONS.CREATE, data);
    return response.data;
  },

  async updateLesson(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await api.put(ENDPOINTS.LESSONS.UPDATE(id), data);
    return response.data;
  },

  async deleteLesson(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(ENDPOINTS.LESSONS.DELETE(id));
    return response.data;
  },

  async reorderLessons(
    moduleId: string,
    lessonIds: string[]
  ): Promise<ApiResponse<void>> {
    const lessonsToUpdate = lessonIds.map((id, index) => ({
      id,
      orderIndex: index,
    }));
    const response = await api.put(ENDPOINTS.LESSONS.REORDER, {
      moduleId,
      lessons: lessonsToUpdate,
    });
    return response.data;
  },
};
