import { Request, Response, NextFunction } from 'express';
import { bookmarksService } from './bookmarks.service';
import { AppError } from '../../shared/errors/AppError';

export async function getUserBookmarks(
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

    const data = await bookmarksService.getUserBookmarks(tenantId, studentId);

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function toggleBookmark(
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
    const courseId = req.params.courseId as string;

    const data = await bookmarksService.toggleBookmark(
      tenantId,
      studentId,
      courseId
    );

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function checkBookmark(
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
    const courseId = req.params.courseId as string;

    const data = await bookmarksService.checkBookmark(
      tenantId,
      studentId,
      courseId
    );

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}
