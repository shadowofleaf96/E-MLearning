import { Router } from 'express';
import * as controller from './analytics.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { UserRole } from '@prisma/client';

const router = Router();

router.get(
  '/instructor/students',
  authenticate,
  authorize(UserRole.instructor, UserRole.admin, UserRole.super_admin),
  controller.getInstructorStudents
);

router.get(
  '/instructor',
  authenticate,
  authorize(UserRole.instructor, UserRole.admin, UserRole.super_admin),
  controller.getInstructorAnalytics
);

router.get(
  '/admin',
  authenticate,
  authorize(UserRole.admin, UserRole.super_admin),
  controller.getAdminAnalytics
);

router.get('/student', authenticate, controller.getStudentAnalytics);

export default router;
