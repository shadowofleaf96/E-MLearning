import prisma from '../../shared/database/prisma';

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
};
