import { Request, Response, NextFunction } from 'express';
import { tenantsService } from './tenants.service';

export async function resolveTenant(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const domain = req.query.domain as string;
    const subdomain = req.query.subdomain as string;
    const slug = req.query.slug as string;

    const tenant = await tenantsService.resolveTenant(domain, subdomain, slug);

    res.json({ status: 'success', data: tenant });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentTenant(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      res
        .status(404)
        .json({ status: 'error', message: 'No tenant context found' });
      return;
    }
    const tenant = await tenantsService.getTenantById(tenantId);
    res.json({ status: 'success', data: tenant });
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
    const tenants = await tenantsService.getAllTenants();
    res.json({ status: 'success', data: tenants });
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
    const { id } = req.params;
    const tenant = await tenantsService.getTenantById(id as string);
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
    const tenant = await tenantsService.createTenant(req.body);
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
    const { id } = req.params;
    const tenant = await tenantsService.updateTenant(id as string, req.body);
    res.json({ status: 'success', data: tenant });
  } catch (error) {
    next(error);
  }
}

export async function updateTheme(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { themeConfig } = req.body;
    const tenant = await tenantsService.updateTheme(id as string, themeConfig);
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
    const { id } = req.params;
    await tenantsService.deleteTenant(id as string);
    res.json({ status: 'success', message: 'Tenant deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function updateNotificationSettings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { notificationSettings } = req.body;
    const tenant = await tenantsService.updateNotificationSettings(
      id as string,
      notificationSettings
    );
    res.json({ status: 'success', data: tenant });
  } catch (error) {
    next(error);
  }
}
