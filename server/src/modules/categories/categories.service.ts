import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const categoriesService = {
  async getAllCategories(tenantId?: string) {
    const where: any = {};
    if (tenantId) {
      where.OR = [{ tenantId }, { tenantId: null }];
    }

    const categories = await (prisma as any).category.findMany({
      where,
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          select: { id: true, name: true, slug: true, icon: true },
        },
        _count: {
          select: {
            courses: {
              where: {
                isPublished: true,
                ...(tenantId ? { tenantId } : {}),
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return categories;
  },

  async getCategoryTree(tenantId?: string) {
    const where: any = { parentId: null };
    if (tenantId) {
      where.OR = [{ tenantId }, { tenantId: null }];
    }

    return (prisma as any).category.findMany({
      where,
      include: {
        children: {
          include: {
            children: true,
            _count: { select: { courses: true } },
          },
        },
        _count: { select: { courses: true } },
      },
      orderBy: { name: 'asc' },
    });
  },

  async getCategoryById(id: string) {
    const category = await (prisma as any).category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });

    if (!category) {
      throw AppError.notFound('Category not found');
    }

    return category;
  },

  async getCategoryBySlug(slug: string, tenantId?: string) {
    const where: any = { slug };
    if (tenantId) {
      where.OR = [{ tenantId }, { tenantId: null }];
    }

    const category = await (prisma as any).category.findFirst({
      where,
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });

    if (!category) {
      throw AppError.notFound('Category not found');
    }

    return category;
  },

  async createCategory(
    data: {
      name: string;
      slug?: string;
      description?: string;
      icon?: string;
      parentId?: string;
    },
    tenantId?: string
  ) {
    const slug = data.slug || generateSlug(data.name);

    const existing = await (prisma as any).category.findFirst({
      where: {
        slug,
        tenantId: tenantId || null,
      },
    });

    if (existing) {
      throw AppError.badRequest('A category with this slug already exists');
    }

    return (prisma as any).category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        icon: data.icon,
        parentId: data.parentId || null,
        tenantId: tenantId || null,
      },
    });
  },

  async updateCategory(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      icon?: string;
      parentId?: string | null;
    },
    tenantId?: string
  ) {
    const category = await (prisma as any).category.findUnique({
      where: { id },
    });

    if (!category) {
      throw AppError.notFound('Category not found');
    }

    if (tenantId && category.tenantId && category.tenantId !== tenantId) {
      throw AppError.forbidden(
        'Cannot modify category belonging to another tenant'
      );
    }

    const slug = data.slug || (data.name ? generateSlug(data.name) : undefined);

    return (prisma as any).category.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(slug ? { slug } : {}),
        ...(data.description !== undefined
          ? { description: data.description }
          : {}),
        ...(data.icon !== undefined ? { icon: data.icon } : {}),
        ...(data.parentId !== undefined ? { parentId: data.parentId } : {}),
      },
    });
  },

  async deleteCategory(id: string, tenantId?: string) {
    const category = await (prisma as any).category.findUnique({
      where: { id },
    });

    if (!category) {
      throw AppError.notFound('Category not found');
    }

    if (tenantId && category.tenantId && category.tenantId !== tenantId) {
      throw AppError.forbidden(
        'Cannot delete category belonging to another tenant'
      );
    }

    await (prisma as any).category.delete({
      where: { id },
    });

    return { message: 'Category deleted successfully' };
  },
};
