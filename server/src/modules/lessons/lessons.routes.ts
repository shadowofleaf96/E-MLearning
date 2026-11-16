import { Router } from 'express';
import * as controller from './lessons.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validateRequest } from '../../middlewares/validateRequest';
import { lessonsSchemas } from './lessons.validator';

const router = Router();

router.get('/module/:moduleId', authenticate, controller.getLessonsByModule);
router.get('/:id', authenticate, controller.getLessonById);
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  validateRequest({ body: lessonsSchemas.createLesson }),
  controller.createLesson
);
router.put(
  '/:id',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  validateRequest({ body: lessonsSchemas.updateLesson }),
  controller.updateLesson
);
router.put(
  '/reorder',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  validateRequest({ body: lessonsSchemas.reorderLessons }),
  controller.reorderLessons
);
router.delete(
  '/:id',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.deleteLesson
);

export default router;
