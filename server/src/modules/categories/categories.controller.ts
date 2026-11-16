import { Request, Response, NextFunction } from 'express';
import { categoriesService } from './categories.service';

export async function getAllCategories(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId =
      req.tenant?.id ||
      req.user?.tenantId ||
      (req.query.tenantId as string | undefined);
    const categories = await categoriesService.getAllCategories(tenantId);
    res.json({ status: 'success', data: categories });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryTree(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId =
      req.tenant?.id ||
      req.user?.tenantId ||
      (req.query.tenantId as string | undefined);
    const tree = await categoriesService.getCategoryTree(tenantId);
    res.json({ status: 'success', data: tree });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const category = await categoriesService.getCategoryById(id);
    res.json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const category = await categoriesService.createCategory(req.body, tenantId);
    res.status(201).json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const category = await categoriesService.updateCategory(
      id,
      req.body,
      tenantId
    );
    res.json({ status: 'success', data: category });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const result = await categoriesService.deleteCategory(id, tenantId);
    res.json({ status: 'success', ...result });
  } catch (error) {
    next(error);
  }
}
