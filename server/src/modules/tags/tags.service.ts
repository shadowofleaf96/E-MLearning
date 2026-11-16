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

export const tagsService = {
  async getTags(tenantId?: string) {
    const where: any = {};
    if (tenantId) {
      where.OR = [{ tenantId }, { tenantId: null }];
    }

    return (prisma as any).tag.findMany({
      where,
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  },

  async createTag(name: string, tenantId?: string) {
    const slug = generateSlug(name);
    const existing = await (prisma as any).tag.findFirst({
      where: {
        slug,
        tenantId: tenantId || null,
      },
    });

    if (existing) {
      return existing;
    }

    return (prisma as any).tag.create({
      data: {
        name: name.trim(),
        slug,
        tenantId: tenantId || null,
      },
    });
  },

  async deleteTag(id: string, tenantId?: string) {
    const tag = await (prisma as any).tag.findUnique({ where: { id } });
    if (!tag) {
      throw AppError.notFound('Tag not found');
    }
    if (tenantId && tag.tenantId && tag.tenantId !== tenantId) {
      throw AppError.forbidden('Cannot delete tag belonging to another tenant');
    }

    await (prisma as any).tag.delete({ where: { id } });
    return { success: true };
  },

  async getCourseTags(courseId: string) {
    const courseTags = await (prisma as any).courseTag.findMany({
      where: { courseId },
      include: { tag: true },
    });
    return courseTags.map((ct: any) => ct.tag);
  },

  async assignCourseTags(courseId: string, tagIds: string[], tenantId: string) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, tenantId },
    });
    if (!course) {
      throw AppError.notFound('Course not found');
    }

    // Delete existing assignments
    await (prisma as any).courseTag.deleteMany({
      where: { courseId },
    });

    // Create new assignments
    if (tagIds.length > 0) {
      await (prisma as any).courseTag.createMany({
        data: tagIds.map((tagId) => ({
          courseId,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    return this.getCourseTags(courseId);
  },
};
