import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export interface LiveSession {
  id: string;
  tenantId: string;
  moduleId: string;
  instructorId: string;
  title: string;
  scheduledAt: string;
  durationMinutes: number;
  roomId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  instructor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  participants?: any[];
  module?: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
}

export const liveService = {
  async getSessions(
    params?: Record<string, any>
  ): Promise<ApiResponse<LiveSession[]>> {
    const response = await api.get(ENDPOINTS.LIVE.LIST, { params });
    return response.data;
  },

  async getSessionsByModule(
    moduleId: string
  ): Promise<ApiResponse<LiveSession[]>> {
    const response = await api.get(ENDPOINTS.LIVE.MODULE(moduleId));
    return response.data;
  },

  async getSessionById(id: string): Promise<ApiResponse<LiveSession>> {
    const response = await api.get(ENDPOINTS.LIVE.DETAIL(id));
    return response.data;
  },

  async createSession(data: {
    title: string;
    scheduledAt: string | Date;
    durationMinutes: number;
    moduleId: string;
    roomId?: string;
  }): Promise<ApiResponse<LiveSession>> {
    const response = await api.post(ENDPOINTS.LIVE.CREATE, data);
    return response.data;
  },

  async updateSession(
    id: string,
    data: Partial<LiveSession>
  ): Promise<ApiResponse<LiveSession>> {
    const response = await api.put(ENDPOINTS.LIVE.UPDATE(id), data);
    return response.data;
  },

  async deleteSession(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(ENDPOINTS.LIVE.DELETE(id));
    return response.data;
  },

  async joinSession(id: string): Promise<ApiResponse<any>> {
    const response = await api.post(ENDPOINTS.LIVE.JOIN(id));
    return response.data;
  },

  async leaveSession(id: string): Promise<ApiResponse<any>> {
    const response = await api.post(ENDPOINTS.LIVE.LEAVE(id));
    return response.data;
  },
};
