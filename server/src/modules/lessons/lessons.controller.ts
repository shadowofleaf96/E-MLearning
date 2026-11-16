import { Request, Response, NextFunction } from 'express';
import { lessonsService } from './lessons.service';
import { AppError } from '../../shared/errors/AppError';

export async function getLessonsByModule(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const moduleId = req.params.moduleId as string;
    const lessons = await lessonsService.getLessonsByModule(moduleId, tenantId);
    res.json({ status: 'success', data: lessons });
  } catch (error) {
    next(error);
  }
}

export async function getLessonById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const id = req.params.id as string;
    const lesson = await lessonsService.getLessonById(id, tenantId);
    res.json({ status: 'success', data: lesson });
  } catch (error) {
    next(error);
  }
}

export async function createLesson(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw AppError.unauthorized('User not authenticated');
    }
    const lesson = await lessonsService.createLesson(
      req.body,
      tenantId,
      userId,
      role
    );
    res.status(201).json({ status: 'success', data: lesson });
  } catch (error) {
    next(error);
  }
}

export async function updateLesson(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw AppError.unauthorized('User not authenticated');
    }
    const id = req.params.id as string;
    const lesson = await lessonsService.updateLesson(
      id,
      req.body,
      tenantId,
      userId,
      role
    );
    res.json({ status: 'success', data: lesson });
  } catch (error) {
    next(error);
  }
}

export async function deleteLesson(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw AppError.unauthorized('User not authenticated');
    }
    const id = req.params.id as string;
    await lessonsService.deleteLesson(id, tenantId, userId, role);
    res.json({ status: 'success', message: 'Lesson deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function reorderLessons(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw AppError.unauthorized('User not authenticated');
    }
    const { moduleId, lessons } = req.body;
    const result = await lessonsService.reorderLessons(
      moduleId,
      lessons,
      tenantId,
      userId,
      role
    );
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}
