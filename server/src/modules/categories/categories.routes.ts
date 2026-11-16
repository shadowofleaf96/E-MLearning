import { Router } from 'express';
import * as controller from './categories.controller';
import {
  authenticate,
  optionalAuthenticate,
} from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validateRequest } from '../../middlewares/validateRequest';
import { categoriesSchemas } from './categories.validator';

const router = Router();

router.get('/', optionalAuthenticate, controller.getAllCategories);
router.get('/tree', optionalAuthenticate, controller.getCategoryTree);
router.get('/:id', optionalAuthenticate, controller.getCategoryById);
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  validateRequest({ body: categoriesSchemas.createCategory }),
  controller.createCategory
);
router.put(
  '/:id',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  validateRequest({ body: categoriesSchemas.updateCategory }),
  controller.updateCategory
);
router.delete(
  '/:id',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.deleteCategory
);

export default router;
