import { Request, Response, NextFunction } from 'express';
import prisma from '../shared/database/prisma';
import { AppError } from '../shared/errors/AppError';

/**
 * Tenant resolver middleware.
 * Extracts tenant from:
 *  1. X-Tenant-ID header (for API clients)
 *  2. Subdomain (e.g., institute1.etactiques.com)
 * Attaches the tenant to req.tenant
 */
export async function tenantResolver(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const headerTenantId = req.headers['x-tenant-id'] as string | undefined;
    const headerTenantSlug = req.headers['x-tenant-slug'] as string | undefined;
    const host = req.hostname;
    const parts = host.split('.');
    const subdomain = parts.length > 2 ? parts[0] : undefined;

    // Build query filters based on identifiers
    const filters: any[] = [];
    if (headerTenantId) {
      filters.push({ id: headerTenantId }, { slug: headerTenantId });
    }
    if (headerTenantSlug) {
      filters.push({ slug: headerTenantSlug });
    }
    if (subdomain) {
      filters.push({ slug: subdomain });
    }
    if (host) {
      filters.push({ domain: host });
    }

    if (filters.length === 0) {
      return next();
    }

    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: filters,
        isActive: true,
      },
    });

    if (!tenant) {
      // If header was supplied but no active tenant matched, raise not found error
      if (headerTenantId) {
        throw AppError.notFound('Tenant not found or inactive');
      }
      // Otherwise allow for public/fallback routes
      return next();
    }

    req.tenant = tenant;
    next();
  } catch (err) {
    next(err);
  }
}
