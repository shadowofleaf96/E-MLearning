import { Request, Response, NextFunction } from 'express';
import { codingService } from './coding.service';
import { AppError } from '../../shared/errors/AppError';

export async function getExercise(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const exerciseId = req.params.exerciseId as string;
    if (!tenantId) throw AppError.badRequest('Tenant ID is required');

    const exercise = await codingService.getExercise(tenantId, exerciseId);
    res.json({ status: 'success', data: exercise });
  } catch (error) {
    next(error);
  }
}

export async function createExercise(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.status(501).json({
      status: 'error',
      message:
        'createExercise not yet implemented (use exams endpoint instead)',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateExercise(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res
      .status(501)
      .json({ status: 'error', message: 'updateExercise not yet implemented' });
  } catch (error) {
    next(error);
  }
}

export async function submitCode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const { exerciseId, code, attemptId } = req.body;
    if (!tenantId) throw AppError.badRequest('Tenant ID is required');

    const result = await codingService.submitCode(
      tenantId,
      exerciseId,
      code,
      attemptId
    );
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export async function getSubmissionResult(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const submissionId = req.params.submissionId as string;
    if (!tenantId) throw AppError.badRequest('Tenant ID is required');

    const result = await codingService.getSubmissionResult(
      tenantId,
      submissionId
    );
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}
