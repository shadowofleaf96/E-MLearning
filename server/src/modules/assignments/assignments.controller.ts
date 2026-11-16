import { Request, Response, NextFunction } from 'express';
import { assignmentsService } from './assignments.service';
import { AppError } from '../../shared/errors/AppError';
import { UserRole } from '@prisma/client';

export async function getModuleAssignments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const moduleId = req.params.moduleId as string;
    const studentId = req.user?.role === UserRole.student ? req.user.id : undefined;

    const data = await assignmentsService.getModuleAssignments(
      tenantId,
      moduleId,
      studentId
    );

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCourseAssignments(
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
    const studentId = req.user?.role === UserRole.student ? req.user.id : undefined;

    const data = await assignmentsService.getCourseAssignments(
      tenantId,
      courseId,
      studentId
    );

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createAssignment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }

    const assignment = await assignmentsService.createAssignment(
      tenantId,
      req.body
    );

    res.status(201).json({
      status: 'success',
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
}

export async function submitAssignment(
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

    const submission = await assignmentsService.submitAssignment(
      tenantId,
      studentId,
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: submission,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAssignmentSubmissions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const assignmentId = req.params.assignmentId as string;

    const submissions = await assignmentsService.getAssignmentSubmissions(
      tenantId,
      assignmentId
    );

    res.status(200).json({
      status: 'success',
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
}

export async function gradeSubmission(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const submissionId = req.params.submissionId as string;

    const graded = await assignmentsService.gradeSubmission(
      tenantId,
      submissionId,
      req.body
    );

    res.status(200).json({
      status: 'success',
      data: graded,
    });
  } catch (error) {
    next(error);
  }
}
