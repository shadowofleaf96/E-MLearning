import { Router } from 'express';
import * as controller from './learning-paths.controller';
import {
  authenticate,
  optionalAuthenticate,
} from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

const router = Router();

// Public / student paths list
router.get('/', optionalAuthenticate, controller.getLearningPaths);

// Student enrolled paths
router.get(
  '/enrolled',
  authenticate,
  authorize('student', 'instructor', 'admin', 'super_admin'),
  controller.getEnrolledLearningPaths
);

// Instructor's created paths
router.get(
  '/instructor',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.getInstructorLearningPaths
);

// Learning path detail
router.get('/:id', optionalAuthenticate, controller.getLearningPathById);

// Create path (Instructor/Admin)
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.createLearningPath
);

// Update path
router.put(
  '/:id',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.updateLearningPath
);

// Delete path
router.delete(
  '/:id',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.deleteLearningPath
);

// Enroll in path
router.post(
  '/:id/enroll',
  authenticate,
  authorize('student', 'instructor', 'admin', 'super_admin'),
  controller.enrollLearningPath
);

export default router;
