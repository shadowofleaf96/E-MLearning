import { Router } from 'express';
import { uploadFile, uploadMiddleware } from './upload.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

const router = Router();

// Only instructors and admins can upload course files
router.post(
  '/',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  uploadMiddleware.single('file'),
  uploadFile
);

export default router;
