import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';
import { notificationsService } from './notifications.service';

export const campaignsService = {
  async getCampaigns(tenantId: string) {
    return prisma.emailCampaign.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getCampaignById(tenantId: string, id: string) {
    return prisma.emailCampaign.findFirst({
      where: { id, tenantId },
    });
  },

  async createCampaign(tenantId: string, data: any) {
    return prisma.emailCampaign.create({
      data: {
        ...data,
        tenantId,
      },
    });
  },

  async updateCampaign(tenantId: string, id: string, data: any) {
    return prisma.emailCampaign.updateMany({
      where: { id, tenantId },
      data,
    });
  },

  async deleteCampaign(tenantId: string, id: string) {
    return prisma.emailCampaign.deleteMany({
      where: { id, tenantId },
    });
  },

  async sendCampaign(
    tenantId: string,
    id: string,
    options?: { targetAudience?: string; courseId?: string }
  ) {
    const campaign = await prisma.emailCampaign.findFirst({
      where: { id, tenantId },
    });
    if (!campaign) {
      throw AppError.notFound('Campaign not found');
    }

    const whereUser: any = { tenantId, status: 'active' };
    const audience = options?.targetAudience || 'All Users';

    if (audience === 'Students' || audience === 'student') {
      whereUser.role = 'student';
    } else if (audience === 'Instructors' || audience === 'instructor') {
      whereUser.role = 'instructor';
    }

    if (options?.courseId) {
      whereUser.enrollments = { some: { courseId: options.courseId } };
    }

    const targetUsers = await prisma.user.findMany({
      where: whereUser,
      select: { id: true, email: true },
    });

    if (targetUsers.length > 0) {
      await notificationsService.createBatchNotifications(
        targetUsers.map((u) => ({
          tenantId,
          userId: u.id,
          title: campaign.subject || campaign.name,
          message: campaign.content,
          type: 'campaign',
        }))
      );
    }

    const updated = await prisma.emailCampaign.update({
      where: { id },
      data: {
        status: 'Sent',
        recipientCount: targetUsers.length,
        sentAt: new Date(),
      },
    });

    return {
      campaign: updated,
      recipients: targetUsers.length,
    };
  },
};
