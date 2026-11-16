import { Request, Response, NextFunction } from 'express';
import { liveService } from './live.service';
import { AppError } from '../../shared/errors/AppError';

export async function getSessions(
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

    let sessions;
    if (role === 'instructor') {
      sessions = await liveService.getSessionsByInstructor(userId, tenantId);
    } else {
      const moduleId = req.query.moduleId as string;
      if (moduleId) {
        sessions = await liveService.getSessionsByModule(moduleId, tenantId);
      } else {
        sessions = await liveService.getSessionsByInstructor(userId, tenantId);
      }
    }

    res.status(200).json({
      status: 'success',
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSessionsByModule(
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

    const sessions = await liveService.getSessionsByModule(moduleId, tenantId);
    res.status(200).json({
      status: 'success',
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSessionById(
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

    const session = await liveService.getSessionById(id, tenantId);
    res.status(200).json({
      status: 'success',
      data: session,
    });
  } catch (error) {
    next(error);
  }
}

export async function createSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!tenantId || !userId || !role) {
      throw AppError.unauthorized('Authentication context missing');
    }

    const newSession = await liveService.createSession(
      req.body,
      tenantId,
      userId,
      role
    );

    res.status(201).json({
      status: 'success',
      data: newSession,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!tenantId || !userId || !role) {
      throw AppError.unauthorized('Authentication context missing');
    }
    const id = req.params.id as string;

    const updatedSession = await liveService.updateSession(
      id,
      req.body,
      tenantId,
      userId,
      role
    );

    res.status(200).json({
      status: 'success',
      data: updatedSession,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!tenantId || !userId || !role) {
      throw AppError.unauthorized('Authentication context missing');
    }
    const id = req.params.id as string;

    await liveService.deleteSession(id, tenantId, userId, role);

    res.status(200).json({
      status: 'success',
      message: 'Live session deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function joinSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const userId = req.user?.id;
    if (!tenantId || !userId) {
      throw AppError.unauthorized('Authentication context missing');
    }
    const id = req.params.id as string;

    const participant = await liveService.joinSession(id, userId, tenantId);

    res.status(200).json({
      status: 'success',
      data: participant,
    });
  } catch (error) {
    next(error);
  }
}

export async function leaveSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const userId = req.user?.id;
    if (!tenantId || !userId) {
      throw AppError.unauthorized('Authentication context missing');
    }
    const id = req.params.id as string;

    const participant = await liveService.leaveSession(id, userId, tenantId);

    res.status(200).json({
      status: 'success',
      data: participant,
    });
  } catch (error) {
    next(error);
  }
}
