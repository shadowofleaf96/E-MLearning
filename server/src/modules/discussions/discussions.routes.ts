import { Router } from 'express';
import * as controller from './discussions.controller';
import { authenticate, optionalAuthenticate } from '../../middlewares/authenticate';
import { validateRequest } from '../../middlewares/validateRequest';
import { discussionSchemas } from './discussions.validator';

const router = Router();

// Public/student: list discussions for course
router.get('/course/:courseId', optionalAuthenticate, controller.getCourseDiscussions);
router.get('/:id', optionalAuthenticate, controller.getDiscussionById);

// Protected: create, reply, upvote, solve, pin, delete
router.post(
  '/',
  authenticate,
  validateRequest(discussionSchemas.createDiscussion),
  controller.createDiscussion
);
router.post(
  '/reply',
  authenticate,
  validateRequest(discussionSchemas.createReply),
  controller.createReply
);
router.post('/:id/upvote', authenticate, controller.upvoteDiscussion);
router.post('/reply/:id/upvote', authenticate, controller.upvoteReply);
router.post('/reply/:id/solution', authenticate, controller.markSolution);
router.post('/:id/pin', authenticate, controller.togglePin);
router.delete('/:id', authenticate, controller.deleteDiscussion);

export default router;
