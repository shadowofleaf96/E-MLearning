import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export const bookmarksService = {
  async getUserBookmarks(tenantId: string, studentId: string) {
    const bookmarks = await prisma.bookmark.findMany({
      where: { tenantId, studentId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
            _count: {
              select: {
                modules: true,
                enrollments: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return bookmarks.map((b) => ({
      ...b.course,
      bookmarkedAt: b.createdAt,
    }));
  },

  async toggleBookmark(tenantId: string, studentId: string, courseId: string) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, tenantId },
    });

    if (!course) {
      throw AppError.notFound('Course not found');
    }

    const existing = await prisma.bookmark.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return { bookmarked: false };
    }

    await prisma.bookmark.create({
      data: {
        tenantId,
        studentId,
        courseId,
      },
    });

    return { bookmarked: true };
  },

  async checkBookmark(tenantId: string, studentId: string, courseId: string) {
    const existing = await prisma.bookmark.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    return { bookmarked: !!existing };
  },
};
