import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export interface LessonProgressItem {
  lessonId: string;
  completed: boolean;
  timeSpent: number;
  completedAt: string | null;
}

export interface StudentNoteItem {
  id: string;
  courseId: string;
  lessonId: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
  lesson?: { id: string; title: string };
}

export interface ModuleProgress {
  id: string;
  studentId: string;
  moduleId: string;
  progressPercentage: number;
  completed: boolean;
  lastAccessedAt: string;
}

export const progressService = {
  async getCourseProgress(courseId: string): Promise<ApiResponse<any>> {
    const response = await api.get(ENDPOINTS.PROGRESS.GET(courseId));
    return response.data;
  },

  async getProgress(courseId: string): Promise<ApiResponse<any>> {
    return this.getCourseProgress(courseId);
  },

  async updateProgress(
    arg1: string,
    arg2: string | number,
    arg3?: number | boolean,
    arg4?: boolean
  ): Promise<ApiResponse<any>> {
    // If called as (moduleId, percentage)
    if (typeof arg2 === 'number') {
      const moduleId = arg1;
      const progressPercentage = arg2;
      const completed = typeof arg3 === 'boolean' ? arg3 : progressPercentage >= 100;
      const response = await api.put(ENDPOINTS.PROGRESS.UPDATE(moduleId), {
        progressPercentage,
        completed,
      });
      return response.data;
    }
    // If called as (courseId, moduleId, progressPercentage, completed)
    const courseId = arg1;
    const moduleId = arg2 as string;
    const progressPercentage = (arg3 as number) || 0;
    const completed = !!arg4;
    const response = await api.put(ENDPOINTS.PROGRESS.UPDATE(moduleId), {
      courseId,
      progressPercentage,
      completed,
    });
    return response.data;
  },

  async updateLessonProgress(
    lessonId: string,
    data: { completed?: boolean; timeSpent?: number }
  ): Promise<ApiResponse<any>> {
    const response = await api.put(ENDPOINTS.PROGRESS.UPDATE_LESSON(lessonId), data);
    return response.data;
  },

  async getCourseLessonProgress(courseId: string): Promise<ApiResponse<LessonProgressItem[]>> {
    const response = await api.get(ENDPOINTS.PROGRESS.COURSE_LESSONS(courseId));
    return response.data;
  },

  async getStudentNotes(courseId: string): Promise<ApiResponse<StudentNoteItem[]>> {
    const response = await api.get(ENDPOINTS.PROGRESS.GET_NOTES(courseId));
    return response.data;
  },

  async saveStudentNote(
    courseId: string,
    content: string,
    lessonId?: string
  ): Promise<ApiResponse<StudentNoteItem>> {
    const response = await api.post(ENDPOINTS.PROGRESS.SAVE_NOTE, {
      courseId,
      content,
      lessonId,
    });
    return response.data;
  },
};
