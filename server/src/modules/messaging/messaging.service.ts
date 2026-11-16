import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export const messagingService = {
  async getConversations(tenantId: string, userId: string) {
    const conversations = await prisma.conversation.findMany({
      where: {
        tenantId,
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
      include: {
        participant1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
        participant2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    return conversations.map((conv) => {
      const otherUser =
        conv.participant1Id === userId ? conv.participant2 : conv.participant1;
      const lastMsg = conv.messages[0] || null;

      return {
        id: conv.id,
        otherUser,
        lastMessage: lastMsg,
        lastMessageAt: conv.lastMessageAt,
      };
    });
  },

  async getMessages(tenantId: string, userId: string, conversationId: string) {
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        tenantId,
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
    });

    if (!conversation) {
      throw AppError.notFound('Conversation not found');
    }

    // Auto mark received messages as read
    await prisma.directMessage.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return prisma.directMessage.findMany({
      where: { conversationId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  },

  async sendMessage(
    tenantId: string,
    senderId: string,
    data: { recipientId: string; content: string; fileUrl?: string }
  ) {
    if (senderId === data.recipientId) {
      throw AppError.badRequest('Cannot send message to yourself');
    }

    const recipient = await prisma.user.findFirst({
      where: { id: data.recipientId, tenantId },
    });

    if (!recipient) {
      throw AppError.notFound('Recipient user not found');
    }

    // Canonical order for unique pair index
    const [p1, p2] =
      senderId < data.recipientId
        ? [senderId, data.recipientId]
        : [data.recipientId, senderId];

    let conversation = await prisma.conversation.findUnique({
      where: {
        participant1Id_participant2Id: {
          participant1Id: p1,
          participant2Id: p2,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          tenantId,
          participant1Id: p1,
          participant2Id: p2,
          lastMessageAt: new Date(),
        },
      });
    } else {
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });
    }

    return prisma.directMessage.create({
      data: {
        tenantId,
        conversationId: conversation.id,
        senderId,
        content: data.content,
        fileUrl: data.fileUrl,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
  },

  async getUnreadCount(tenantId: string, userId: string) {
    const count = await prisma.directMessage.count({
      where: {
        tenantId,
        isRead: false,
        senderId: { not: userId },
        conversation: {
          OR: [{ participant1Id: userId }, { participant2Id: userId }],
        },
      },
    });

    return { unreadCount: count };
  },
};
