import { Request, Response, NextFunction } from 'express';
import { modulesService } from './modules.service';
import { AppError } from '../../shared/errors/AppError';

export async function getModulesByCourse(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const courseId = req.params.courseId as string;
    const modules = await modulesService.getModulesByCourse(courseId, tenantId);
    res.json({ status: 'success', data: modules });
  } catch (error) {
    next(error);
  }
}

export async function getModuleById(
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
    const moduleItem = await modulesService.getModuleById(id, tenantId);
    res.json({ status: 'success', data: moduleItem });
  } catch (error) {
    next(error);
  }
}

export async function createModule(
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
    const moduleItem = await modulesService.createModule(
      req.body,
      tenantId,
      userId,
      role
    );
    res.status(201).json({ status: 'success', data: moduleItem });
  } catch (error) {
    next(error);
  }
}

export async function updateModule(
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
    const moduleItem = await modulesService.updateModule(
      id,
      req.body,
      tenantId,
      userId,
      role
    );
    res.json({ status: 'success', data: moduleItem });
  } catch (error) {
    next(error);
  }
}

export async function reorderModules(
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
    const { courseId, modules } = req.body;
    const result = await modulesService.reorderModules(
      courseId,
      modules,
      tenantId,
      userId,
      role
    );
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export async function deleteModule(
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
    await modulesService.deleteModule(id, tenantId, userId, role);
    res.json({ status: 'success', message: 'Module deleted successfully' });
  } catch (error) {
    next(error);
  }
}
