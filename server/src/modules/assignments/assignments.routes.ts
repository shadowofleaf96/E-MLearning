import { Router } from 'express';
import * as controller from './assignments.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validateRequest } from '../../middlewares/validateRequest';
import { assignmentSchemas } from './assignments.validator';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Student & instructor: view assignments
router.get('/module/:moduleId', controller.getModuleAssignments);
router.get('/course/:courseId', controller.getCourseAssignments);

// Student: submit assignment
router.post(
  '/submit',
  authorize(UserRole.student),
  validateRequest(assignmentSchemas.submitAssignment),
  controller.submitAssignment
);

// Instructor / Admin: create assignment, view submissions, grade
router.post(
  '/',
  authorize(UserRole.instructor, UserRole.admin, UserRole.super_admin),
  validateRequest(assignmentSchemas.createAssignment),
  controller.createAssignment
);

router.get(
  '/:assignmentId/submissions',
  authorize(UserRole.instructor, UserRole.admin, UserRole.super_admin),
  controller.getAssignmentSubmissions
);

router.put(
  '/submission/:submissionId/grade',
  authorize(UserRole.instructor, UserRole.admin, UserRole.super_admin),
  validateRequest(assignmentSchemas.gradeSubmission),
  controller.gradeSubmission
);

export default router;
