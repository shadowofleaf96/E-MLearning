import { Router } from 'express';
import * as controller from './exams.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
const router = Router();
router.get(
  '/instructor/me',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.getInstructorExams
);
router.get('/module/:moduleId', controller.getExamsByModule);
router.get('/:id', controller.getExamById);
router.post('/', authenticate, controller.createExam);
router.put('/:id', authenticate, controller.updateExam);
router.delete('/:id', authenticate, controller.deleteExam);
router.post('/:id/attempt', authenticate, controller.startAttempt);
router.put(
  '/attempt/:attemptId/submit',
  authenticate,
  controller.submitAttempt
);
export default router;
