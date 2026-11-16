import { Router } from 'express';
import * as controller from './tags.controller';
import {
  authenticate,
  optionalAuthenticate,
} from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

const router = Router();

router.get('/', optionalAuthenticate, controller.getTags);
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.createTag
);
router.delete(
  '/:id',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.deleteTag
);
router.get('/course/:courseId', optionalAuthenticate, controller.getCourseTags);
router.post(
  '/assign',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.assignCourseTags
);

export default router;
