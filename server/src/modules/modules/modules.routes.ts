import { Router } from 'express';
import * as controller from './modules.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validateRequest } from '../../middlewares/validateRequest';
import { modulesSchemas } from './modules.validator';

const router = Router();

router.get('/course/:courseId', authenticate, controller.getModulesByCourse);
router.get('/:id', authenticate, controller.getModuleById);
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  validateRequest({ body: modulesSchemas.createModule }),
  controller.createModule
);
router.put(
  '/reorder',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  validateRequest({ body: modulesSchemas.reorderModules }),
  controller.reorderModules
);
router.put(
  '/:id',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  validateRequest({ body: modulesSchemas.updateModule }),
  controller.updateModule
);
router.delete(
  '/:id',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.deleteModule
);

export default router;
