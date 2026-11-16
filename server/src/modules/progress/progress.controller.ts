import { Request, Response, NextFunction } from 'express';
import { progressService } from './progress.service';
import { AppError } from '../../shared/errors/AppError';

export async function getStudentProgress(
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

    const progress = await progressService.getStudentProgress(
      tenantId,
      studentId
    );

    res.status(200).json({
      status: 'success',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCourseProgress(
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

    const modules = await progressService.getCourseProgress(
      tenantId,
      studentId,
      courseId
    );

    res.status(200).json({
      status: 'success',
      data: modules,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateModuleProgress(
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
    const moduleId = req.params.moduleId as string;

    const progress = await progressService.updateModuleProgress(
      tenantId,
      studentId,
      moduleId,
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDashboardStats(
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

    const stats = await progressService.getDashboardStats(tenantId, studentId);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLessonProgress(
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
    const lessonId = req.params.lessonId as string;

    const progress = await progressService.updateLessonProgress(
      tenantId,
      studentId,
      lessonId,
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCourseLessonProgress(
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

    const progress = await progressService.getCourseLessonProgress(
      tenantId,
      studentId,
      courseId
    );

    res.status(200).json({
      status: 'success',
      data: progress,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentNotes(
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

    const notes = await progressService.getStudentNotes(
      tenantId,
      studentId,
      courseId
    );

    res.status(200).json({
      status: 'success',
      data: notes,
    });
  } catch (error) {
    next(error);
  }
}

export async function saveStudentNote(
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
    const { courseId, lessonId, content } = req.body;

    const note = await progressService.saveStudentNote(
      tenantId,
      studentId,
      courseId,
      { lessonId, content }
    );

    res.status(200).json({
      status: 'success',
      data: note,
    });
  } catch (error) {
    next(error);
  }
}
