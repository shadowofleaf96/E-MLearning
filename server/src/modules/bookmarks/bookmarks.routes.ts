import { Router } from 'express';
import * as controller from './bookmarks.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.get('/', authenticate, controller.getUserBookmarks);
router.post('/toggle/:courseId', authenticate, controller.toggleBookmark);
router.get('/check/:courseId', authenticate, controller.checkBookmark);

export default router;
