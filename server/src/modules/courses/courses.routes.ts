import { Router } from 'express';
import * as controller from './courses.controller';
import {
  authenticate,
  optionalAuthenticate,
} from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validateRequest } from '../../middlewares/validateRequest';
import { coursesSchemas } from './courses.validator';

const router = Router();

router.get('/', optionalAuthenticate, controller.getAllCourses);
router.get(
  '/enrolled',
  authenticate,
  authorize('student', 'instructor', 'admin', 'super_admin'),
  controller.getEnrolledCourses
);
router.get(
  '/tenant-students',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.getTenantStudents
);
router.get(
  '/admin/pending-review',
  authenticate,
  authorize('admin', 'super_admin'),
  controller.getAdminModerationQueue
);
router.get('/:id', optionalAuthenticate, controller.getCourseById);
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  validateRequest({ body: coursesSchemas.createCourse }),
  controller.createCourse
);
router.put(
  '/:id',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  validateRequest({ body: coursesSchemas.updateCourse }),
  controller.updateCourse
);
router.put(
  '/:id/publish',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.publishCourse
);
router.post(
  '/:id/submit-for-review',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.submitForReview
);
router.post(
  '/:id/moderation',
  authenticate,
  authorize('admin', 'super_admin'),
  controller.moderateCourse
);
router.get(
  '/:id/moderation-logs',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.getModerationLogs
);
router.delete(
  '/:id',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.deleteCourse
);
router.post(
  '/:id/enroll',
  authenticate,
  authorize('student', 'instructor', 'admin', 'super_admin'),
  controller.enrollStudent
);

// Instructor enrollment management
router.post(
  '/:id/enroll-by-email',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.enrollStudentByEmail
);
router.post(
  '/:id/enroll-bulk',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.bulkEnrollStudents
);
router.get(
  '/:id/enrolled-students',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.getEnrolledStudents
);
router.delete(
  '/:id/enrolled-students/:studentId',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.unenrollStudent
);

export default router;
