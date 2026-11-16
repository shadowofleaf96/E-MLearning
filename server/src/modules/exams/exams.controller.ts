import { Request, Response, NextFunction } from 'express';
import { examsService } from './exams.service';
import { AppError } from '../../shared/errors/AppError';

export async function getInstructorExams(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const instructorId = req.user?.id;
    if (!tenantId) throw AppError.badRequest('Tenant ID is required');
    if (!instructorId) throw AppError.unauthorized('User not authenticated');

    const exams = await examsService.getInstructorExams(tenantId, instructorId);

    // Transform backend data to match the expected structure
    const transformed = exams.map((exam) => {
      const avgScore =
        exam.examAttempts.length > 0
          ? Math.round(
              exam.examAttempts.reduce((acc, curr) => acc + curr.score, 0) /
                exam.examAttempts.length
            )
          : undefined;

      let mappedType = 'Mixed';
      if (exam.type === 'qcm') mappedType = 'Multiple Choice';
      if (exam.type === 'coding') mappedType = 'Coding Challenge';

      return {
        id: exam.id,
        title: exam.title,
        courseName: exam.module.course.title,
        type: mappedType,
        status: 'Published', // Since we don't have draft in backend schema yet
        questionsCount: exam._count.questions,
        participantsCount: exam._count.examAttempts,
        averageScore: avgScore,
        lastUpdated: exam.updatedAt.toISOString(),
      };
    });

    res.json({ status: 'success', data: transformed });
  } catch (error) {
    next(error);
  }
}

export async function getExamsByModule(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const moduleId = req.params.moduleId as string;
    if (!tenantId) throw AppError.badRequest('Tenant ID is required');

    const exams = await examsService.getExamsByModule(tenantId, moduleId);
    res.json({ status: 'success', data: exams });
  } catch (error) {
    next(error);
  }
}

export async function getExamById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const id = req.params.id as string;
    const includeAnswers =
      req.user?.role === 'instructor' || req.user?.role === 'admin';
    if (!tenantId) throw AppError.badRequest('Tenant ID is required');

    const exam = await examsService.getExamById(tenantId, id, includeAnswers);
    res.json({ status: 'success', data: exam });
  } catch (error) {
    next(error);
  }
}

export async function createExam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const { moduleId } = req.body;
    if (!tenantId) throw AppError.badRequest('Tenant ID is required');

    const exam = await examsService.createExam(tenantId, moduleId, req.body);
    res.status(201).json({ status: 'success', data: exam });
  } catch (error) {
    next(error);
  }
}

export async function updateExam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const id = req.params.id as string;
    if (!tenantId) throw AppError.badRequest('Tenant ID is required');

    const exam = await examsService.updateExam(tenantId, id, req.body);
    res.json({ status: 'success', data: exam });
  } catch (error) {
    next(error);
  }
}

export async function deleteExam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const id = req.params.id as string;
    if (!tenantId) throw AppError.badRequest('Tenant ID is required');

    await examsService.deleteExam(tenantId, id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function startAttempt(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const id = req.params.id as string;
    const studentId = req.user?.id;
    if (!tenantId || !studentId)
      throw AppError.badRequest('Missing tenant or user ID');

    const attempt = await examsService.startAttempt(tenantId, id, studentId);
    res.status(201).json({ status: 'success', data: attempt });
  } catch (error) {
    next(error);
  }
}

export async function submitAttempt(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const attemptId = req.params.attemptId as string;
    const { answers } = req.body; // array of { questionId, optionId }
    if (!tenantId) throw AppError.badRequest('Tenant ID is required');

    const result = await examsService.submitAttempt(
      tenantId,
      attemptId,
      answers || []
    );
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}
