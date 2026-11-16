import { Request, Response, NextFunction } from 'express';
import { aiService } from './ai.service';
import { AppError } from '../../shared/errors/AppError';

export async function generateCourseOutline(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await aiService.generateCourseOutline(req.body);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function generateModule(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await aiService.generateModule(req.body);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function generateLessonContent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await aiService.generateLessonContent(req.body);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function generateQuiz(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await aiService.generateQuiz(req.body);
    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function saveAiCourse(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }

    const instructorId = req.user!.id;
    const course = await aiService.saveAiCourse(tenantId, instructorId, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Course and full curriculum generated and saved successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
}
