import { Request, Response, NextFunction } from 'express';
import { learningPathsService } from './learning-paths.service';
import { AppError } from '../../shared/errors/AppError';

export async function getLearningPaths(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId =
      req.tenant?.id ||
      req.user?.tenantId ||
      (req.query.tenantId as string | undefined);
    const isPublished =
      req.query.isPublished !== undefined
        ? req.query.isPublished === 'true'
        : true; // default public endpoint to only published paths

    const paths = await learningPathsService.getAll(tenantId, isPublished);
    res.json({ status: 'success', data: paths });
  } catch (error) {
    next(error);
  }
}

export async function getEnrolledLearningPaths(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const studentId = req.user!.id;
    const tenantId = req.tenant?.id || req.user?.tenantId;

    const paths = await learningPathsService.getEnrolled(studentId, tenantId);
    res.json({ status: 'success', data: paths });
  } catch (error) {
    next(error);
  }
}

export async function getInstructorLearningPaths(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const instructorId = req.user!.id;
    const tenantId = req.tenant?.id || req.user?.tenantId;

    const paths = await learningPathsService.getByInstructor(
      instructorId,
      tenantId
    );
    res.json({ status: 'success', data: paths });
  } catch (error) {
    next(error);
  }
}

export async function getLearningPathById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const studentId = req.user?.id;

    const path = await learningPathsService.getById(id, tenantId, studentId);
    res.json({ status: 'success', data: path });
  } catch (error) {
    next(error);
  }
}

export async function createLearningPath(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const instructorId = req.user!.id;
    const tenantId = req.tenant?.id || req.user!.tenantId;

    const path = await learningPathsService.create(
      instructorId,
      tenantId,
      req.body
    );
    res.status(201).json({ status: 'success', data: path });
  } catch (error) {
    next(error);
  }
}

export async function updateLearningPath(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const instructorId = req.user!.id;
    const role = req.user!.role;
    const tenantId = req.tenant?.id || req.user!.tenantId;

    const path = await learningPathsService.update(
      id,
      instructorId,
      role,
      tenantId,
      req.body
    );
    res.json({ status: 'success', data: path });
  } catch (error) {
    next(error);
  }
}

export async function deleteLearningPath(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const instructorId = req.user!.id;
    const role = req.user!.role;
    const tenantId = req.tenant?.id || req.user!.tenantId;

    const result = await learningPathsService.delete(
      id,
      instructorId,
      role,
      tenantId
    );
    res.json({ status: 'success', ...result });
  } catch (error) {
    next(error);
  }
}

export async function enrollLearningPath(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const learningPathId = req.params.id as string;
    const studentId = req.user!.id;
    const tenantId = req.tenant?.id || req.user!.tenantId;

    const result = await learningPathsService.enroll(
      learningPathId,
      studentId,
      tenantId
    );
    res.json({ status: 'success', ...result });
  } catch (error) {
    next(error);
  }
}
