import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export const uploadService = {
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(ENDPOINTS.UPLOADS.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.url;
  },
};
