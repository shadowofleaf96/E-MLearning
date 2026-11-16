import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export interface DiscussionAuthor {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
}

export interface DiscussionReplyItem {
  id: string;
  discussionId: string;
  content: string;
  isSolution: boolean;
  upvotes: number;
  createdAt: string;
  user: DiscussionAuthor;
}

export interface CourseDiscussionItem {
  id: string;
  courseId: string;
  lessonId: string | null;
  title: string;
  content: string;
  isPinned: boolean;
  isClosed: boolean;
  upvotes: number;
  createdAt: string;
  user: DiscussionAuthor;
  lesson?: { id: string; title: string } | null;
  _count?: { replies: number };
  replies?: DiscussionReplyItem[];
}

export const discussionsService = {
  async getCourseDiscussions(
    courseId: string,
    lessonId?: string
  ): Promise<ApiResponse<CourseDiscussionItem[]>> {
    const url = lessonId
      ? `${ENDPOINTS.DISCUSSIONS.COURSE(courseId)}?lessonId=${lessonId}`
      : ENDPOINTS.DISCUSSIONS.COURSE(courseId);
    const response = await api.get(url);
    return response.data;
  },

  async getDiscussion(id: string): Promise<ApiResponse<CourseDiscussionItem>> {
    const response = await api.get(ENDPOINTS.DISCUSSIONS.DETAIL(id));
    return response.data;
  },

  async createDiscussion(data: {
    courseId: string;
    lessonId?: string;
    title: string;
    content: string;
  }): Promise<ApiResponse<CourseDiscussionItem>> {
    const response = await api.post(ENDPOINTS.DISCUSSIONS.CREATE, data);
    return response.data;
  },

  async createReply(data: {
    discussionId: string;
    content: string;
  }): Promise<ApiResponse<DiscussionReplyItem>> {
    const response = await api.post(ENDPOINTS.DISCUSSIONS.REPLY, data);
    return response.data;
  },

  async upvoteDiscussion(id: string): Promise<ApiResponse<any>> {
    const response = await api.post(ENDPOINTS.DISCUSSIONS.UPVOTE(id));
    return response.data;
  },

  async upvoteReply(id: string): Promise<ApiResponse<any>> {
    const response = await api.post(ENDPOINTS.DISCUSSIONS.UPVOTE_REPLY(id));
    return response.data;
  },

  async markSolution(id: string): Promise<ApiResponse<any>> {
    const response = await api.post(ENDPOINTS.DISCUSSIONS.SOLUTION(id));
    return response.data;
  },

  async togglePin(id: string): Promise<ApiResponse<any>> {
    const response = await api.post(ENDPOINTS.DISCUSSIONS.PIN(id));
    return response.data;
  },

  async deleteDiscussion(id: string): Promise<ApiResponse<any>> {
    const response = await api.delete(ENDPOINTS.DISCUSSIONS.DELETE(id));
    return response.data;
  },
};
