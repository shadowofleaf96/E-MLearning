import { Router } from 'express';
import * as controller from './reviews.controller';
import {
  authenticate,
  optionalAuthenticate,
} from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validateRequest';
import { reviewSchemas } from './reviews.validator';

const router = Router();

// Public: get course reviews
router.get(
  '/course/:courseId',
  optionalAuthenticate,
  controller.getCourseReviews
);

// Protected: create, update, delete
router.post(
  '/',
  authenticate,
  validateRequest(reviewSchemas.createReview),
  controller.createReview
);
router.put(
  '/:id',
  authenticate,
  validateRequest(reviewSchemas.updateReview),
  controller.updateReview
);
router.delete('/:id', authenticate, controller.deleteReview);

export default router;
