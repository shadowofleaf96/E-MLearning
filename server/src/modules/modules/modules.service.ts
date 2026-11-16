import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export const modulesService = {
  async getModulesByCourse(courseId: string, tenantId: string) {
    return prisma.module.findMany({
      where: { courseId, tenantId },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });
  },

  async getModuleById(id: string, tenantId: string) {
    const module = await prisma.module.findFirst({
      where: { id, tenantId },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
    if (!module) {
      throw AppError.notFound('Module not found');
    }
    return module;
  },

  async createModule(
    data: any,
    tenantId: string,
    userId: string,
    role: string
  ) {
    const course = await prisma.course.findFirst({
      where: { id: data.courseId, tenantId },
    });
    if (!course) {
      throw AppError.notFound('Course not found');
    }
    if (role === 'instructor' && course.instructorId !== userId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }
    return prisma.module.create({
      data: {
        ...data,
        publishAt: data.publishAt ? new Date(data.publishAt) : null,
        tenantId,
      },
    });
  },

  async updateModule(
    id: string,
    data: any,
    tenantId: string,
    userId: string,
    role: string
  ) {
    const moduleItem = await prisma.module.findFirst({
      where: { id, tenantId },
      include: { course: true },
    });
    if (!moduleItem) {
      throw AppError.notFound('Module not found');
    }
    if (role === 'instructor' && moduleItem.course.instructorId !== userId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }
    return prisma.module.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : moduleItem.title,
        description:
          data.description !== undefined
            ? data.description
            : moduleItem.description,
        orderIndex:
          data.orderIndex !== undefined
            ? data.orderIndex
            : moduleItem.orderIndex,
        isLocked:
          data.isLocked !== undefined ? data.isLocked : moduleItem.isLocked,
        publishAt:
          data.publishAt !== undefined
            ? data.publishAt
              ? new Date(data.publishAt)
              : null
            : moduleItem.publishAt,
      },
    });
  },

  async reorderModules(
    courseId: string,
    modulesList: { id: string; orderIndex: number }[],
    tenantId: string,
    userId: string,
    role: string
  ) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, tenantId },
    });
    if (!course) {
      throw AppError.notFound('Course not found');
    }
    if (role === 'instructor' && course.instructorId !== userId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }

    const updates = modulesList.map((m) =>
      prisma.module.update({
        where: { id: m.id, courseId, tenantId },
        data: { orderIndex: m.orderIndex },
      })
    );

    return prisma.$transaction(updates);
  },

  async deleteModule(
    id: string,
    tenantId: string,
    userId: string,
    role: string
  ) {
    const moduleItem = await prisma.module.findFirst({
      where: { id, tenantId },
      include: { course: true },
    });
    if (!moduleItem) {
      throw AppError.notFound('Module not found');
    }
    if (role === 'instructor' && moduleItem.course.instructorId !== userId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }
    await prisma.module.delete({
      where: { id },
    });
  },
};
