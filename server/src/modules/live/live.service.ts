import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export const liveService = {
  async getSessionsByModule(moduleId: string, tenantId: string) {
    return prisma.liveSession.findMany({
      where: { moduleId, tenantId },
      include: {
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        participants: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  },

  async getSessionsByInstructor(instructorId: string, tenantId: string) {
    return prisma.liveSession.findMany({
      where: { instructorId, tenantId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
        participants: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });
  },

  async getSessionById(id: string, tenantId: string) {
    const session = await prisma.liveSession.findFirst({
      where: { id, tenantId },
      include: {
        instructor: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        module: {
          include: { course: true },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!session) {
      throw AppError.notFound('Live session not found');
    }
    return session;
  },

  async createSession(
    data: {
      title: string;
      scheduledAt: Date | string;
      durationMinutes: number;
      moduleId: string;
      roomId?: string;
    },
    tenantId: string,
    userId: string,
    role: string
  ) {
    // Verify the module exists and belongs to a course owned by the instructor
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

    return prisma.liveSession.create({
      data: {
        title: data.title,
        scheduledAt: new Date(data.scheduledAt),
        durationMinutes: Number(data.durationMinutes),
        roomId:
          data.roomId || `room-${Math.random().toString(36).substr(2, 9)}`,
        moduleId: data.moduleId,
        instructorId: userId,
        tenantId,
      },
    });
  },

  async updateSession(
    id: string,
    data: any,
    tenantId: string,
    userId: string,
    role: string
  ) {
    const session = await prisma.liveSession.findFirst({
      where: { id, tenantId },
    });

    if (!session) {
      throw AppError.notFound('Live session not found');
    }

    if (role === 'instructor' && session.instructorId !== userId) {
      throw AppError.forbidden('Access denied. You do not own this session.');
    }

    return prisma.liveSession.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title : session.title,
        scheduledAt:
          data.scheduledAt !== undefined
            ? new Date(data.scheduledAt)
            : session.scheduledAt,
        durationMinutes:
          data.durationMinutes !== undefined
            ? Number(data.durationMinutes)
            : session.durationMinutes,
        isActive:
          data.isActive !== undefined
            ? Boolean(data.isActive)
            : session.isActive,
        roomId: data.roomId !== undefined ? data.roomId : session.roomId,
      },
    });
  },

  async deleteSession(
    id: string,
    tenantId: string,
    userId: string,
    role: string
  ) {
    const session = await prisma.liveSession.findFirst({
      where: { id, tenantId },
    });

    if (!session) {
      throw AppError.notFound('Live session not found');
    }

    if (role === 'instructor' && session.instructorId !== userId) {
      throw AppError.forbidden('Access denied. You do not own this session.');
    }

    await prisma.liveSession.delete({
      where: { id },
    });
  },

  async joinSession(liveSessionId: string, userId: string, tenantId: string) {
    const session = await prisma.liveSession.findFirst({
      where: { id: liveSessionId, tenantId },
    });

    if (!session) {
      throw AppError.notFound('Live session not found');
    }

    // Check if participant is already registered
    const existing = await prisma.sessionParticipant.findFirst({
      where: { liveSessionId, userId, tenantId },
    });

    if (existing) {
      // Re-joining, update leftAt to null
      return prisma.sessionParticipant.update({
        where: { id: existing.id },
        data: { leftAt: null, joinedAt: new Date() },
      });
    }

    return prisma.sessionParticipant.create({
      data: {
        liveSessionId,
        userId,
        tenantId,
      },
    });
  },

  async leaveSession(liveSessionId: string, userId: string, tenantId: string) {
    const existing = await prisma.sessionParticipant.findFirst({
      where: { liveSessionId, userId, tenantId },
    });

    if (!existing) {
      throw AppError.notFound('Participant not found in this session');
    }

    return prisma.sessionParticipant.update({
      where: { id: existing.id },
      data: { leftAt: new Date() },
    });
  },
};
