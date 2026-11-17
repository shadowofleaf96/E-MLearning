import api from '@/services/api';

export const examsService = {
  async getExamsByModule(moduleId: string) {
    const response = await api.get(`/exams/module/${moduleId}`);
    return response.data.data;
  },

  async getExamById(examId: string) {
    const response = await api.get(`/exams/${examId}`);
    return response.data.data;
  },

  async createExam(data: any) {
    const response = await api.post('/exams', data);
    return response.data.data;
  },

  async updateExam(examId: string, data: any) {
    const response = await api.put(`/exams/${examId}`, data);
    return response.data.data;
  },

  async deleteExam(examId: string) {
    const response = await api.delete(`/exams/${examId}`);
    return response.data;
  },

  async startAttempt(examId: string) {
    const response = await api.post(`/exams/${examId}/attempt`);
    return response.data.data;
  },

  async submitAttempt(attemptId: string, answers: any[]) {
    const response = await api.put(`/exams/attempt/${attemptId}/submit`, {
      answers,
    });
    return response.data.data;
  },
};
