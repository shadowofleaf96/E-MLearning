import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export const reviewsService = {
  async getCourseReviews(tenantId: string, courseId: string) {
    const reviews = await prisma.courseReview.findMany({
      where: {
        tenantId,
        courseId,
        isApproved: true,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = reviews.length;
    const avgRating =
      total > 0
        ? Number(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
          )
        : 0;

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    return {
      reviews,
      stats: {
        total,
        averageRating: avgRating,
        distribution,
      },
    };
  },

  async createReview(
    tenantId: string,
    studentId: string,
    data: { courseId: string; rating: number; comment?: string }
  ) {
    // Check if enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: data.courseId,
        },
      },
    });

    if (!enrollment) {
      throw AppError.forbidden('You must be enrolled in this course to leave a review');
    }

    // Check if review already exists
    const existing = await prisma.courseReview.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: data.courseId,
        },
      },
    });

    if (existing) {
      return prisma.courseReview.update({
        where: { id: existing.id },
        data: {
          rating: data.rating,
          comment: data.comment,
        },
      });
    }

    return prisma.courseReview.create({
      data: {
        tenantId,
        studentId,
        courseId: data.courseId,
        rating: data.rating,
        comment: data.comment,
        isApproved: true,
      },
    });
  },

  async updateReview(
    tenantId: string,
    studentId: string,
    reviewId: string,
    data: { rating?: number; comment?: string }
  ) {
    const review = await prisma.courseReview.findFirst({
      where: { id: reviewId, tenantId, studentId },
    });

    if (!review) {
      throw AppError.notFound('Review not found');
    }

    return prisma.courseReview.update({
      where: { id: reviewId },
      data,
    });
  },

  async deleteReview(tenantId: string, reviewId: string, userId: string, isAdmin: boolean) {
    const review = await prisma.courseReview.findFirst({
      where: { id: reviewId, tenantId },
    });

    if (!review) {
      throw AppError.notFound('Review not found');
    }

    if (!isAdmin && review.studentId !== userId) {
      throw AppError.forbidden('Not authorized to delete this review');
    }

    return prisma.courseReview.delete({
      where: { id: reviewId },
    });
  },
};
