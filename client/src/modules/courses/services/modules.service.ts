import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export const modulesService = {
  async getModulesByCourse(courseId: string): Promise<ApiResponse<any[]>> {
    const response = await api.get(ENDPOINTS.COURSES.MODULES(courseId));
    return response.data;
  },

  async createModule(data: any): Promise<ApiResponse<any>> {
    const response = await api.post(ENDPOINTS.MODULES.CREATE, data);
    return response.data;
  },

  async updateModule(id: string, data: any): Promise<ApiResponse<any>> {
    const response = await api.put(ENDPOINTS.MODULES.UPDATE(id), data);
    return response.data;
  },

  async deleteModule(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(ENDPOINTS.MODULES.DELETE(id));
    return response.data;
  },

  async reorderModules(
    courseId: string,
    moduleIds: string[]
  ): Promise<ApiResponse<void>> {
    const modulesToUpdate = moduleIds.map((id, index) => ({
      id,
      orderIndex: index,
    }));
    const response = await api.put(ENDPOINTS.MODULES.REORDER, {
      courseId,
      modules: modulesToUpdate,
    });
    return response.data;
  },
};
