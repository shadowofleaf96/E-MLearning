import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';
import { User } from '@/types/user.types';

export const usersService = {
  async getUsers(
    params?: Record<string, any>
  ): Promise<{ status: string; users: User[] }> {
    const response = await api.get(ENDPOINTS.USERS.LIST, { params });
    return response.data;
  },

  async getUser(id: string): Promise<{ status: string; user: User }> {
    const response = await api.get(`${ENDPOINTS.USERS.LIST}/${id}`);
    return response.data;
  },

  async createUser(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await api.post(ENDPOINTS.USERS.LIST, data);
    return response.data;
  },

  async updateUser(
    id: string,
    data: Partial<User>
  ): Promise<ApiResponse<User>> {
    const response = await api.put(`${ENDPOINTS.USERS.LIST}/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`${ENDPOINTS.USERS.LIST}/${id}`);
    return response.data;
  },
};
