import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export interface CourseOutlinePayload {
  topic: string;
  targetLevel?: string;
  moduleCount?: number;
  language?: string;
  categoryId?: string;
}

export interface GeneratedLesson {
  title: string;
  type: 'video' | 'text' | 'pdf' | 'link';
  duration: number;
  content?: string;
  description?: string;
}

export interface GeneratedModule {
  title: string;
  description: string;
  orderIndex: number;
  lessons: GeneratedLesson[];
}

export interface GeneratedCourseOutline {
  title: string;
  description: string;
  targetLevel: string;
  estimatedTotalHours: number;
  modules: GeneratedModule[];
}

export const aiClientService = {
  async generateCourseOutline(
    payload: CourseOutlinePayload
  ): Promise<ApiResponse<GeneratedCourseOutline>> {
    const response = await api.post(ENDPOINTS.AI.GENERATE_OUTLINE, payload);
    return response.data;
  },

  async generateModule(payload: {
    topic: string;
    courseTitle?: string;
    lessonCount?: number;
    language?: string;
  }): Promise<ApiResponse<GeneratedModule>> {
    const response = await api.post(ENDPOINTS.AI.GENERATE_MODULE, payload);
    return response.data;
  },

  async generateLessonContent(payload: {
    lessonTitle: string;
    lessonType?: string;
    moduleTitle?: string;
    courseTitle?: string;
    language?: string;
  }): Promise<ApiResponse<{ content: string; keyTakeaways: string[] }>> {
    const response = await api.post(
      ENDPOINTS.AI.GENERATE_LESSON_CONTENT,
      payload
    );
    return response.data;
  },

  async generateQuiz(payload: {
    topic: string;
    questionCount?: number;
    difficulty?: string;
    language?: string;
  }): Promise<ApiResponse<{ questions: any[]; passingScore: number }>> {
    const response = await api.post(ENDPOINTS.AI.GENERATE_QUIZ, payload);
    return response.data;
  },

  async saveAiCourse(payload: {
    title: string;
    description?: string;
    categoryId?: string | null;
    price?: number;
    modules: GeneratedModule[];
  }): Promise<ApiResponse<any>> {
    const response = await api.post(ENDPOINTS.AI.SAVE_COURSE, payload);
    return response.data;
  },
};
