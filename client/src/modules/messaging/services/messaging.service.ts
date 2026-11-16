import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export interface ConversationParticipant {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  role: string;
}

export interface ConversationItem {
  id: string;
  otherUser: ConversationParticipant;
  lastMessage: {
    id: string;
    content: string;
    fileUrl: string | null;
    isRead: boolean;
    createdAt: string;
    senderId: string;
  } | null;
  lastMessageAt: string;
}

export interface DirectMessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  fileUrl: string | null;
  isRead: boolean;
  createdAt: string;
  sender: ConversationParticipant;
}

export const messagingService = {
  async getConversations(): Promise<ApiResponse<ConversationItem[]>> {
    const response = await api.get(ENDPOINTS.MESSAGING.CONVERSATIONS);
    return response.data;
  },

  async getMessages(
    conversationId: string
  ): Promise<ApiResponse<DirectMessageItem[]>> {
    const response = await api.get(
      ENDPOINTS.MESSAGING.MESSAGES(conversationId)
    );
    return response.data;
  },

  async sendMessage(data: {
    recipientId: string;
    content: string;
    fileUrl?: string;
  }): Promise<ApiResponse<DirectMessageItem>> {
    const response = await api.post(ENDPOINTS.MESSAGING.SEND, data);
    return response.data;
  },

  async getUnreadCount(): Promise<ApiResponse<{ unreadCount: number }>> {
    const response = await api.get(ENDPOINTS.MESSAGING.UNREAD_COUNT);
    return response.data;
  },
};
