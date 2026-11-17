import { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service';
import { AppError } from '../../shared/errors/AppError';

export async function getInstructorAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const userId = req.user?.id;

    if (!tenantId || !userId) {
      throw AppError.unauthorized('User session not active');
    }

    const analytics = await analyticsService.getInstructorAnalytics(
      userId,
      tenantId
    );

    res.status(200).json({
      status: 'success',
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;

    if (!tenantId) {
      throw AppError.unauthorized('User session not active');
    }

    const analytics = await analyticsService.getAdminAnalytics(tenantId);

    res.status(200).json({
      status: 'success',
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
}

export async function getInstructorStudents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const userId = req.user?.id;

    if (!tenantId || !userId) {
      throw AppError.unauthorized('User session not active');
    }

    const students = await analyticsService.getInstructorStudents(
      userId,
      tenantId
    );

    res.status(200).json({
      status: 'success',
      data: students,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const userId = req.user?.id;

    if (!tenantId || !userId) {
      throw AppError.unauthorized('User session not active');
    }

    const analytics = await analyticsService.getStudentAnalytics(
      userId,
      tenantId
    );

    res.status(200).json({
      status: 'success',
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
}
