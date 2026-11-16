import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export interface AssignmentItem {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  dueDate: string | null;
  maxScore: number;
  createdAt: string;
  _count?: { submissions: number };
  module?: { id: string; title: string };
  submission?: {
    id: string;
    grade: number | null;
    feedback: string | null;
    submittedAt: string;
    gradedAt: string | null;
    fileUrl: string | null;
    content?: string | null;
  } | null;
}

export interface SubmissionItem {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string | null;
  fileUrl: string | null;
  grade: number | null;
  feedback: string | null;
  submittedAt: string;
  gradedAt: string | null;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string | null;
  };
}

export const assignmentsService = {
  async getModuleAssignments(
    moduleId: string
  ): Promise<ApiResponse<AssignmentItem[]>> {
    const response = await api.get(ENDPOINTS.ASSIGNMENTS.MODULE(moduleId));
    return response.data;
  },

  async getCourseAssignments(
    courseId: string
  ): Promise<ApiResponse<AssignmentItem[]>> {
    const response = await api.get(ENDPOINTS.ASSIGNMENTS.COURSE(courseId));
    return response.data;
  },

  async createAssignment(data: {
    moduleId: string;
    title: string;
    description: string;
    dueDate?: string | null;
    maxScore?: number;
  }): Promise<ApiResponse<AssignmentItem>> {
    const response = await api.post(ENDPOINTS.ASSIGNMENTS.CREATE, data);
    return response.data;
  },

  async submitAssignment(data: {
    assignmentId: string;
    content?: string;
    fileUrl?: string;
  }): Promise<ApiResponse<any>> {
    const response = await api.post(ENDPOINTS.ASSIGNMENTS.SUBMIT, data);
    return response.data;
  },

  async getAssignmentSubmissions(
    assignmentId: string
  ): Promise<ApiResponse<SubmissionItem[]>> {
    const response = await api.get(
      ENDPOINTS.ASSIGNMENTS.SUBMISSIONS(assignmentId)
    );
    return response.data;
  },

  async gradeSubmission(
    submissionId: string,
    data: { grade: number; feedback?: string }
  ): Promise<ApiResponse<any>> {
    const response = await api.put(
      ENDPOINTS.ASSIGNMENTS.GRADE(submissionId),
      data
    );
    return response.data;
  },
};
