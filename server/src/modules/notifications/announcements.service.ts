import prisma from '../../shared/database/prisma';

export const announcementsService = {
  async getAnnouncements(tenantId: string) {
    return prisma.announcement.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getAnnouncementById(tenantId: string, id: string) {
    return prisma.announcement.findFirst({
      where: { id, tenantId },
    });
  },

  async createAnnouncement(tenantId: string, data: any) {
    return prisma.announcement.create({
      data: {
        ...data,
        tenantId,
      },
    });
  },

  async updateAnnouncement(tenantId: string, id: string, data: any) {
    return prisma.announcement.updateMany({
      where: { id, tenantId },
      data,
    });
  },

  async deleteAnnouncement(tenantId: string, id: string) {
    return prisma.announcement.deleteMany({
      where: { id, tenantId },
    });
  },
};
