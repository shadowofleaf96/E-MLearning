import prisma from '../../shared/database/prisma';
import { notificationEvents, NOTIFICATION_EVENT } from './notifications.events';
import { integrationsService } from '../integrations/integrations.service';

export const notificationsService = {
  async getNotifications(
    tenantId: string,
    userId: string,
    limit: number = 20,
    offset: number = 0
  ) {
    return prisma.notification.findMany({
      where: { tenantId, userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  },
  async getUnreadCount(tenantId: string, userId: string) {
    return prisma.notification.count({
      where: { tenantId, userId, isRead: false },
    });
  },
  async markAsRead(tenantId: string, userId: string, notificationId: string) {
    return prisma.notification.updateMany({
      where: { id: notificationId, tenantId, userId },
      data: { isRead: true },
    });
  },
  async markAllAsRead(tenantId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { tenantId, userId, isRead: false },
      data: { isRead: true },
    });
  },
  async deleteNotification(
    tenantId: string,
    userId: string,
    notificationId: string
  ) {
    return prisma.notification.deleteMany({
      where: { id: notificationId, tenantId, userId },
    });
  },

  async createNotification(
    tenantId: string,
    userId: string,
    data: { title: string; message: string; type?: string }
  ) {
    const notification = await prisma.notification.create({
      data: {
        tenantId,
        userId,
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        isRead: false,
      },
    });

    // Real-time local SSE push
    notificationEvents.emit(NOTIFICATION_EVENT, notification);

    // Webhook dispatch
    integrationsService.dispatchWebhookEvent(tenantId, 'notification.created', {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      type: notification.type,
      createdAt: notification.createdAt,
    });

    return notification;
  },

  async createBatchNotifications(
    notifications: Array<{
      tenantId: string;
      userId: string;
      title: string;
      message: string;
      type?: string;
    }>
  ) {
    if (notifications.length === 0) return { count: 0 };
    const created = await prisma.notification.createMany({
      data: notifications.map((n) => ({
        tenantId: n.tenantId,
        userId: n.userId,
        title: n.title,
        message: n.message,
        type: n.type || 'announcement',
        isRead: false,
      })),
    });

    // Emit event for each recipient
    for (const n of notifications) {
      notificationEvents.emit(NOTIFICATION_EVENT, {
        tenantId: n.tenantId,
        userId: n.userId,
        title: n.title,
        message: n.message,
        type: n.type || 'announcement',
        createdAt: new Date(),
      });
    }

    return created;
  },
};
