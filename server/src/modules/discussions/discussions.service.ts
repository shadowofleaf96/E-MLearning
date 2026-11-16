import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export const discussionsService = {
  async getCourseDiscussions(
    tenantId: string,
    courseId: string,
    lessonId?: string
  ) {
    const where: any = {
      tenantId,
      courseId,
    };
    if (lessonId) {
      where.lessonId = lessonId;
    }

    return prisma.courseDiscussion.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: { replies: true },
        },
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });
  },

  async getDiscussionById(tenantId: string, discussionId: string) {
    const discussion = await prisma.courseDiscussion.findFirst({
      where: { id: discussionId, tenantId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                role: true,
              },
            },
          },
          orderBy: [{ isSolution: 'desc' }, { createdAt: 'asc' }],
        },
      },
    });

    if (!discussion) {
      throw AppError.notFound('Discussion not found');
    }

    return discussion;
  },

  async createDiscussion(
    tenantId: string,
    userId: string,
    data: {
      courseId: string;
      lessonId?: string;
      title: string;
      content: string;
    }
  ) {
    return prisma.courseDiscussion.create({
      data: {
        tenantId,
        userId,
        courseId: data.courseId,
        lessonId: data.lessonId || null,
        title: data.title,
        content: data.content,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
  },

  async createReply(
    tenantId: string,
    userId: string,
    data: { discussionId: string; content: string }
  ) {
    const discussion = await prisma.courseDiscussion.findFirst({
      where: { id: data.discussionId, tenantId },
    });

    if (!discussion) {
      throw AppError.notFound('Discussion not found');
    }

    if (discussion.isClosed) {
      throw AppError.badRequest('This discussion is closed for replies');
    }

    return prisma.discussionReply.create({
      data: {
        tenantId,
        userId,
        discussionId: data.discussionId,
        content: data.content,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
  },

  async upvoteDiscussion(tenantId: string, discussionId: string) {
    return prisma.courseDiscussion.update({
      where: { id: discussionId },
      data: { upvotes: { increment: 1 } },
    });
  },

  async upvoteReply(tenantId: string, replyId: string) {
    return prisma.discussionReply.update({
      where: { id: replyId },
      data: { upvotes: { increment: 1 } },
    });
  },

  async markSolution(tenantId: string, replyId: string) {
    const reply = await prisma.discussionReply.findFirst({
      where: { id: replyId, tenantId },
    });

    if (!reply) {
      throw AppError.notFound('Reply not found');
    }

    return prisma.discussionReply.update({
      where: { id: replyId },
      data: { isSolution: !reply.isSolution },
    });
  },

  async togglePin(tenantId: string, discussionId: string) {
    const discussion = await prisma.courseDiscussion.findFirst({
      where: { id: discussionId, tenantId },
    });

    if (!discussion) {
      throw AppError.notFound('Discussion not found');
    }

    return prisma.courseDiscussion.update({
      where: { id: discussionId },
      data: { isPinned: !discussion.isPinned },
    });
  },

  async deleteDiscussion(
    tenantId: string,
    discussionId: string,
    userId: string,
    isAdminOrInstructor: boolean
  ) {
    const discussion = await prisma.courseDiscussion.findFirst({
      where: { id: discussionId, tenantId },
    });

    if (!discussion) {
      throw AppError.notFound('Discussion not found');
    }

    if (!isAdminOrInstructor && discussion.userId !== userId) {
      throw AppError.forbidden('Not authorized to delete this discussion');
    }

    return prisma.courseDiscussion.delete({
      where: { id: discussionId },
    });
  },
};
