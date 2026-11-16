import { Request, Response, NextFunction } from 'express';
import { searchService } from './search.service';
import { AppError } from '../../shared/errors/AppError';

export async function search(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.unauthorized('Tenant context missing');
    }
    const q = (req.query.q as string) || '';

    const results = await searchService.searchAll(tenantId, q);

    res.status(200).json({
      status: 'success',
      data: results,
    });
  } catch (error) {
    next(error);
  }
}
