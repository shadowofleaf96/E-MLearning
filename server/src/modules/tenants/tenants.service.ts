import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export const tenantsService = {
  async resolveTenant(domain?: string, subdomain?: string, slug?: string) {
    const filters: any[] = [];
    if (domain) filters.push({ domain });
    if (subdomain) filters.push({ slug: subdomain });
    if (slug) filters.push({ slug });

    if (filters.length === 0) {
      throw AppError.badRequest(
        'Must provide domain, subdomain, or slug to resolve tenant'
      );
    }

    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: filters,
        isActive: true,
      },
    });

    if (!tenant) {
      throw AppError.notFound('Tenant not found or inactive');
    }

    return tenant;
  },

  async getAllTenants() {
    return prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async getTenantById(id: string) {
    const tenant = await prisma.tenant.findUnique({
      where: { id },
    });
    if (!tenant) throw AppError.notFound('Tenant not found');
    return tenant;
  },

  async createTenant(data: {
    name: string;
    slug: string;
    domain?: string;
    logoUrl?: string;
    themeConfig?: any;
    isActive?: boolean;
  }) {
    const existing = await prisma.tenant.findFirst({
      where: {
        OR: [{ slug: data.slug }, { domain: data.domain || undefined }],
      },
    });

    if (existing) {
      throw AppError.badRequest(
        'Tenant with this slug or domain already exists'
      );
    }

    return prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        domain: data.domain,
        logoUrl: data.logoUrl,
        themeConfig: data.themeConfig || {},
        isActive: data.isActive ?? true,
      },
    });
  },

  async updateTenant(
    id: string,
    data: {
      name?: string;
      slug?: string;
      domain?: string;
      logoUrl?: string;
      isActive?: boolean;
      hasPaidCourses?: boolean;
    }
  ) {
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw AppError.notFound('Tenant not found');

    if (data.slug || data.domain) {
      const existing = await prisma.tenant.findFirst({
        where: {
          id: { not: id },
          OR: [
            ...(data.slug ? [{ slug: data.slug }] : []),
            ...(data.domain ? [{ domain: data.domain }] : []),
          ],
        },
      });
      if (existing) {
        throw AppError.badRequest(
          'Another tenant with this slug or domain already exists'
        );
      }
    }

    return prisma.tenant.update({
      where: { id },
      data,
    });
  },

  async updateTheme(id: string, themeConfig: any) {
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw AppError.notFound('Tenant not found');

    return prisma.tenant.update({
      where: { id },
      data: { themeConfig },
    });
  },

  async deleteTenant(id: string) {
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw AppError.notFound('Tenant not found');

    return prisma.tenant.delete({
      where: { id },
    });
  },

  async updateNotificationSettings(id: string, notificationSettings: any) {
    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw AppError.notFound('Tenant not found');

    return prisma.tenant.update({
      where: { id },
      data: { notificationSettings },
    });
  },
};
