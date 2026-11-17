import { Request, Response, NextFunction } from 'express';
import { tagsService } from './tags.service';
import { AppError } from '../../shared/errors/AppError';

export async function getTags(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId =
      req.tenant?.id ||
      req.user?.tenantId ||
      (req.query.tenantId as string | undefined);
    const tags = await tagsService.getTags(tenantId);
    res.json({ status: 'success', data: tags });
  } catch (error) {
    next(error);
  }
}

export async function createTag(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      throw AppError.badRequest('Tag name is required');
    }
    const tag = await tagsService.createTag(name, tenantId);
    res.status(201).json({ status: 'success', data: tag });
  } catch (error) {
    next(error);
  }
}

export async function deleteTag(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const id = req.params.id as string;
    const result = await tagsService.deleteTag(id, tenantId);
    res.json({
      status: 'success',
      message: 'Tag deleted successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCourseTags(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const courseId = req.params.courseId as string;
    const tags = await tagsService.getCourseTags(courseId);
    res.json({ status: 'success', data: tags });
  } catch (error) {
    next(error);
  }
}

export async function assignCourseTags(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const { courseId, tagIds } = req.body;
    if (!courseId || !Array.isArray(tagIds)) {
      throw AppError.badRequest('courseId and tagIds array are required');
    }
    const tags = await tagsService.assignCourseTags(courseId, tagIds, tenantId);
    res.json({ status: 'success', message: 'Course tags updated', data: tags });
  } catch (error) {
    next(error);
  }
}
