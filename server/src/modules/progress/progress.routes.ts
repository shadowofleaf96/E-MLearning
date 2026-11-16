import { Router } from 'express';
import * as controller from './progress.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validateRequest } from '../../middlewares/validateRequest';
import { progressSchemas } from './progress.validator';
import { UserRole } from '@prisma/client';

const router = Router();

// Student progress routes
router.get(
  '/student',
  authenticate,
  authorize(UserRole.student),
  controller.getStudentProgress
);
router.get(
  '/course/:courseId',
  authenticate,
  authorize(UserRole.student),
  controller.getCourseProgress
);
router.put(
  '/module/:moduleId',
  authenticate,
  authorize(UserRole.student),
  validateRequest(progressSchemas.updateProgressSchema),
  controller.updateModuleProgress
);
router.get(
  '/dashboard',
  authenticate,
  authorize(UserRole.student),
  controller.getDashboardStats
);

// Granular lesson progress
router.put(
  '/lesson/:lessonId',
  authenticate,
  authorize(UserRole.student),
  validateRequest(progressSchemas.updateLessonProgressSchema),
  controller.updateLessonProgress
);
router.get(
  '/course/:courseId/lessons',
  authenticate,
  authorize(UserRole.student),
  controller.getCourseLessonProgress
);

// Persistent notes
router.get(
  '/notes/:courseId',
  authenticate,
  authorize(UserRole.student),
  controller.getStudentNotes
);
router.post(
  '/notes',
  authenticate,
  authorize(UserRole.student),
  validateRequest(progressSchemas.saveNoteSchema),
  controller.saveStudentNote
);

export default router;
