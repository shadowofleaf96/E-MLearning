import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export const lessonsService = {
  async getLessonsByModule(moduleId: string, tenantId: string) {
    return prisma.lesson.findMany({
      where: { moduleId, tenantId },
      orderBy: { orderIndex: 'asc' },
    });
  },

  async getLessonById(id: string, tenantId: string) {
    const lesson = await prisma.lesson.findFirst({
      where: { id, tenantId },
    });
    if (!lesson) {
      throw AppError.notFound('Lesson not found');
    }
    return lesson;
  },

  async createLesson(
    data: any,
    tenantId: string,
    userId: string,
    role: string
  ) {
    const moduleItem = await prisma.module.findFirst({
      where: { id: data.moduleId, tenantId },
      include: { course: true },
    });
    if (!moduleItem) {
      throw AppError.notFound('Module not found');
    }
    if (role === 'instructor' && moduleItem.course.instructorId !== userId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }
    return prisma.lesson.create({
      data: {
        ...data,
        publishAt: data.publishAt ? new Date(data.publishAt) : null,
        tenantId,
      },
    });
  },

  async updateLesson(
    id: string,
    data: any,
    tenantId: string,
    userId: string,
    role: string
  ) {
    const lesson = await prisma.lesson.findFirst({
      where: { id, tenantId },
      include: {
        module: {
          include: { course: true },
        },
      },
    });
    if (!lesson) {
      throw AppError.notFound('Lesson not found');
    }
    if (role === 'instructor' && lesson.module.course.instructorId !== userId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }
    return prisma.lesson.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : lesson.title,
        type: data.type !== undefined ? data.type : lesson.type,
        contentUrl:
          data.contentUrl !== undefined ? data.contentUrl : lesson.contentUrl,
        content: data.content !== undefined ? data.content : lesson.content,
        duration: data.duration !== undefined ? data.duration : lesson.duration,
        orderIndex:
          data.orderIndex !== undefined ? data.orderIndex : lesson.orderIndex,
        publishAt:
          data.publishAt !== undefined
            ? data.publishAt
              ? new Date(data.publishAt)
              : null
            : lesson.publishAt,
      },
    });
  },

  async deleteLesson(
    id: string,
    tenantId: string,
    userId: string,
    role: string
  ) {
    const lesson = await prisma.lesson.findFirst({
      where: { id, tenantId },
      include: {
        module: {
          include: { course: true },
        },
      },
    });
    if (!lesson) {
      throw AppError.notFound('Lesson not found');
    }
    if (role === 'instructor' && lesson.module.course.instructorId !== userId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }
    await prisma.lesson.delete({
      where: { id },
    });
  },

  async reorderLessons(
    moduleId: string,
    lessonsList: { id: string; orderIndex: number }[],
    tenantId: string,
    userId: string,
    role: string
  ) {
    const moduleItem = await prisma.module.findFirst({
      where: { id: moduleId, tenantId },
      include: { course: true },
    });
    if (!moduleItem) {
      throw AppError.notFound('Module not found');
    }
    if (role === 'instructor' && moduleItem.course.instructorId !== userId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }

    const updates = lessonsList.map((l) =>
      prisma.lesson.update({
        where: { id: l.id, moduleId, tenantId },
        data: { orderIndex: l.orderIndex },
      })
    );

    return prisma.$transaction(updates);
  },
};
