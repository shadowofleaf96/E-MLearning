import { Request, Response, NextFunction } from 'express';
import { discussionsService } from './discussions.service';
import { AppError } from '../../shared/errors/AppError';
import { UserRole } from '@prisma/client';

export async function getCourseDiscussions(
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
    const lessonId = req.query.lessonId as string | undefined;

    const data = await discussionsService.getCourseDiscussions(
      tenantId,
      courseId,
      lessonId
    );

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDiscussionById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const discussionId = req.params.id as string;

    const data = await discussionsService.getDiscussionById(tenantId, discussionId);

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
}

export async function createDiscussion(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const userId = req.user!.id;

    const discussion = await discussionsService.createDiscussion(
      tenantId,
      userId,
      req.body
    );

    res.status(201).json({
      status: 'success',
      data: discussion,
    });
  } catch (error) {
    next(error);
  }
}

export async function createReply(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const userId = req.user!.id;

    const reply = await discussionsService.createReply(
      tenantId,
      userId,
      req.body
    );

    res.status(201).json({
      status: 'success',
      data: reply,
    });
  } catch (error) {
    next(error);
  }
}

export async function upvoteDiscussion(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const discussionId = req.params.id as string;

    const result = await discussionsService.upvoteDiscussion(tenantId, discussionId);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function upvoteReply(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const replyId = req.params.id as string;

    const result = await discussionsService.upvoteReply(tenantId, replyId);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function markSolution(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const replyId = req.params.id as string;

    const result = await discussionsService.markSolution(tenantId, replyId);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function togglePin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const discussionId = req.params.id as string;

    const result = await discussionsService.togglePin(tenantId, discussionId);

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteDiscussion(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const userId = req.user!.id;
    const discussionId = req.params.id as string;
    const isAdminOrInstructor =
      req.user?.role === UserRole.admin ||
      req.user?.role === UserRole.super_admin ||
      req.user?.role === UserRole.instructor;

    await discussionsService.deleteDiscussion(
      tenantId,
      discussionId,
      userId,
      isAdminOrInstructor
    );

    res.status(200).json({
      status: 'success',
      message: 'Discussion deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
