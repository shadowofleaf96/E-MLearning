import { Request, Response, NextFunction } from 'express';
import { superAdminService } from './super-admin.service';

export async function getPlatformStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const stats = await superAdminService.getPlatformStats();
    res.json({ status: 'success', data: stats });
  } catch (error) {
    next(error);
  }
}

export async function getAllTenants(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';

    const result = await superAdminService.getAllTenants(page, limit, search);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export async function getTenantById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const tenant = await superAdminService.getTenantById(id);
    if (!tenant) {
      res.status(404).json({ status: 'error', message: 'Tenant not found' });
      return;
    }
    res.json({ status: 'success', data: tenant });
  } catch (error) {
    next(error);
  }
}

export async function createTenant(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenant = await superAdminService.createTenant(req.body);
    res.status(201).json({ status: 'success', data: tenant });
  } catch (error) {
    next(error);
  }
}

export async function updateTenant(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const tenant = await superAdminService.updateTenant(id, req.body);
    res.json({ status: 'success', data: tenant });
  } catch (error) {
    next(error);
  }
}

export async function deleteTenant(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    await superAdminService.deleteTenant(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function updateTenantStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const { isActive } = req.body;
    const tenant = await superAdminService.updateTenantStatus(id, isActive);
    res.json({ status: 'success', data: tenant });
  } catch (error) {
    next(error);
  }
}

export async function updateTenantSubscription(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const { subscriptionPlan } = req.body;
    const tenant = await superAdminService.updateTenantSubscription(
      id,
      subscriptionPlan
    );
    res.json({ status: 'success', data: tenant });
  } catch (error) {
    next(error);
  }
}

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const role = req.query.role as string;
    const status = req.query.status as string;

    const result = await superAdminService.getAllUsers(
      page,
      limit,
      search,
      role,
      status
    );
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const { role } = req.body;
    const user = await superAdminService.updateUserRole(id, role);
    res.json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateUserStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status } = req.body;
    const user = await superAdminService.updateUserStatus(id, status);
    res.json({ status: 'success', data: user });
  } catch (error) {
    next(error);
  }
}

export async function getGlobalAnalytics(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const range = (req.query.range as string) || 'Year to Date';
    const analytics = await superAdminService.getGlobalAnalytics(range);
    res.json({ status: 'success', data: analytics });
  } catch (error) {
    next(error);
  }
}

export async function getSaaSPlans(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const plansData = await superAdminService.getSaaSPlansOverview();
    res.json({ status: 'success', data: plansData });
  } catch (error) {
    next(error);
  }
}

export async function updateSaaSPlans(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await superAdminService.updateSaaSPlanConfigs(req.body);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export async function getSecurityOverview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const securityData = await superAdminService.getSecurityOverview();
    res.json({ status: 'success', data: securityData });
  } catch (error) {
    next(error);
  }
}

export async function updateSecuritySettings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await superAdminService.updateSecuritySettings(req.body);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export async function triggerPerimeterScan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await superAdminService.triggerPerimeterScan();
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export async function blacklistIp(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { ip } = req.body;
    const result = await superAdminService.blacklistIp(ip);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export async function resolveIncident(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { incidentId } = req.body;
    const result = await superAdminService.resolveIncident(incidentId);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}
