import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse, PaginatedResponse } from '@/types/api.types';
import { Course, Category } from '@/types/course.types';

export const coursesService = {
  // Public/Student Endpoints
  async getCategories(
    params?: Record<string, any>
  ): Promise<ApiResponse<Category[]>> {
    const response = await api.get(ENDPOINTS.CATEGORIES.LIST, { params });
    return response.data;
  },

  async getCourses(
    params?: Record<string, any>
  ): Promise<PaginatedResponse<Course>> {
    const response = await api.get(ENDPOINTS.COURSES.LIST, { params });
    return response.data;
  },

  async getCourse(id: string): Promise<ApiResponse<Course>> {
    const response = await api.get(ENDPOINTS.COURSES.DETAIL(id));
    return response.data;
  },

  async enrollInCourse(id: string): Promise<ApiResponse<void>> {
    const response = await api.post(ENDPOINTS.COURSES.ENROLL(id));
    return response.data;
  },

  async getEnrolledCourses(): Promise<ApiResponse<Course[]>> {
    const response = await api.get('/courses/enrolled');
    return response.data;
  },

  // Instructor/Admin Endpoints
  async createCourse(data: Partial<Course>): Promise<ApiResponse<Course>> {
    const response = await api.post(ENDPOINTS.COURSES.CREATE, data);
    return response.data;
  },

  async updateCourse(
    id: string,
    data: Partial<Course>
  ): Promise<ApiResponse<Course>> {
    const response = await api.put(ENDPOINTS.COURSES.UPDATE(id), data);
    return response.data;
  },

  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(ENDPOINTS.COURSES.DELETE(id));
    return response.data;
  },

  async publishCourse(
    id: string,
    isPublished: boolean
  ): Promise<ApiResponse<Course>> {
    const response = await api.put(ENDPOINTS.COURSES.PUBLISH(id), {
      isPublished,
    });
    return response.data;
  },

  async enrollStudentByEmail(
    courseId: string,
    email: string
  ): Promise<ApiResponse<any>> {
    const response = await api.post(
      ENDPOINTS.COURSES.ENROLL_BY_EMAIL(courseId),
      {
        email,
      }
    );
    return response.data;
  },

  async bulkEnrollStudents(
    courseId: string,
    data: { emails?: string[]; studentIds?: string[] }
  ): Promise<ApiResponse<any>> {
    const response = await api.post(
      ENDPOINTS.COURSES.ENROLL_BULK(courseId),
      data
    );
    return response.data;
  },

  async getEnrolledStudents(courseId: string): Promise<ApiResponse<any[]>> {
    const response = await api.get(
      ENDPOINTS.COURSES.ENROLLED_STUDENTS(courseId)
    );
    return response.data;
  },

  async unenrollStudent(
    courseId: string,
    studentId: string
  ): Promise<ApiResponse<void>> {
    const response = await api.delete(
      ENDPOINTS.COURSES.UNENROLL_STUDENT(courseId, studentId)
    );
    return response.data;
  },

  async getTenantStudents(): Promise<ApiResponse<any[]>> {
    const response = await api.get(ENDPOINTS.COURSES.TENANT_STUDENTS);
    return response.data;
  },
};
