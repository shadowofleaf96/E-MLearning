import prisma from '../../shared/database/prisma';

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
};
