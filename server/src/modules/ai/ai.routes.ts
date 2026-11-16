import { Router } from 'express';
import * as controller from './ai.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validateRequest } from '../../middlewares/validateRequest';
import { aiSchemas } from './ai.validator';
import { UserRole } from '@prisma/client';

const router = Router();

// Protect all AI authoring routes to instructor and super_admin
router.use(authenticate, authorize(UserRole.instructor, UserRole.super_admin));

router.post(
  '/outline',
  validateRequest({ body: aiSchemas.generateCourseOutline }),
  controller.generateCourseOutline
);

router.post(
  '/module',
  validateRequest({ body: aiSchemas.generateModule }),
  controller.generateModule
);

router.post(
  '/lesson-content',
  validateRequest({ body: aiSchemas.generateLessonContent }),
  controller.generateLessonContent
);

router.post(
  '/quiz',
  validateRequest({ body: aiSchemas.generateQuiz }),
  controller.generateQuiz
);

router.post(
  '/save-course',
  validateRequest({ body: aiSchemas.saveAiCourse }),
  controller.saveAiCourse
);

export default router;
