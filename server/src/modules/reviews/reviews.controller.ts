import { Request, Response, NextFunction } from 'express';
import { reviewsService } from './reviews.service';
import { AppError } from '../../shared/errors/AppError';
import { UserRole } from '@prisma/client';

export async function getCourseReviews(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const courseId = req.params.courseId as string;

    const data = await reviewsService.getCourseReviews(tenantId, courseId);

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const studentId = req.user!.id;

    const review = await reviewsService.createReview(
      tenantId,
      studentId,
      req.body
    );

    res.status(201).json({
      status: 'success',
      data: review,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const studentId = req.user!.id;
    const reviewId = req.params.id as string;

    const review = await reviewsService.updateReview(
      tenantId,
      studentId,
      reviewId,
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: review,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const userId = req.user!.id;
    const reviewId = req.params.id as string;
    const isAdmin =
      req.user?.role === UserRole.admin ||
      req.user?.role === UserRole.super_admin;

    await reviewsService.deleteReview(tenantId, reviewId, userId, isAdmin);

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
