import { Router } from 'express';
import * as controller from './coding.controller';
import { authenticate } from '../../middlewares/authenticate';
const router = Router();
router.get('/exercise/:exerciseId', controller.getExercise);
router.post('/exercise', authenticate, controller.createExercise);
router.put('/exercise/:exerciseId', authenticate, controller.updateExercise);
router.post('/submit', authenticate, controller.submitCode);
router.get(
  '/submission/:submissionId',
  authenticate,
  controller.getSubmissionResult
);
export default router;
