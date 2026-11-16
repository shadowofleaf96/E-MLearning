import { Request, Response, NextFunction } from 'express';
import { gamificationService } from './gamification.service';
import { AppError } from '../../shared/errors/AppError';

export async function getUserStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const userId = req.user?.id;

    if (!tenantId || !userId) {
      throw AppError.unauthorized('User session not active');
    }

    const stats = await gamificationService.getUserStats(userId, tenantId);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

export async function claimDailyBonus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const userId = req.user?.id;

    if (!tenantId || !userId) {
      throw AppError.unauthorized('User session not active');
    }

    const updatedStats = await gamificationService.claimDailyBonus(
      userId,
      tenantId
    );

    res.status(200).json({
      status: 'success',
      data: updatedStats,
    });
  } catch (error) {
    next(error);
  }
}

// ─── Badge CRUD ────────────────────────────────────────────

export async function getCourseBadges(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { courseId } = req.params;
    const badges = await gamificationService.getCourseBadges(courseId);
    res.status(200).json({ status: 'success', data: badges });
  } catch (error) {
    next(error);
  }
}

export async function getEarnedBadges(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const userId = req.user?.id;

    if (!tenantId || !userId) {
      throw AppError.unauthorized('User session not active');
    }

    const badges = await gamificationService.getEarnedBadges(userId, tenantId);
    res.status(200).json({ status: 'success', data: badges });
  } catch (error) {
    next(error);
  }
}

export async function createBadge(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }

    const { courseId } = req.params;
    const { title, description, icon, color, triggerType, triggerValue } =
      req.body;

    if (!title || !triggerType) {
      throw AppError.badRequest('Title and triggerType are required');
    }

    const badge = await gamificationService.createBadge(courseId, tenantId, {
      title,
      description,
      icon: icon || '🏆',
      color: color || '#FFD700',
      triggerType,
      triggerValue: triggerValue || 1,
    });

    res.status(201).json({ status: 'success', data: badge });
  } catch (error) {
    next(error);
  }
}

export async function updateBadge(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { badgeId } = req.params;
    const badge = await gamificationService.updateBadge(badgeId, req.body);
    res.status(200).json({ status: 'success', data: badge });
  } catch (error) {
    next(error);
  }
}

export async function deleteBadge(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { badgeId } = req.params;
    await gamificationService.deleteBadge(badgeId);
    res.status(200).json({ status: 'success', message: 'Badge deleted' });
  } catch (error) {
    next(error);
  }
}

// ─── XP Config ─────────────────────────────────────────────

export async function getXpConfig(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { courseId } = req.params;
    const config = await gamificationService.getXpConfig(courseId);
    res.status(200).json({ status: 'success', data: config });
  } catch (error) {
    next(error);
  }
}

export async function updateXpConfig(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }

    const { courseId } = req.params;
    const { moduleCompletionXp, courseCompletionXp, examPassXp, dailyBonusXp } =
      req.body;

    const config = await gamificationService.upsertXpConfig(
      courseId,
      tenantId,
      {
        moduleCompletionXp,
        courseCompletionXp,
        examPassXp,
        dailyBonusXp,
      }
    );

    res.status(200).json({ status: 'success', data: config });
  } catch (error) {
    next(error);
  }
}
