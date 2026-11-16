import { Router } from 'express';
import * as controller from './users.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { uploadAvatar } from '../../middlewares/upload';

const router = Router();

/**
 * Users Routes
 * Base path: /api/users
 * Restored from original boilerplate userRoutes.ts (user management routes).
 */

// Get all users (admin)
router.get(
  '/',
  authenticate,
  authorize('admin', 'super_admin'),
  controller.getAllUsers
);

// Get current user profile
router.get('/profile', authenticate, controller.getProfile);

// Update user billing info
router.put('/profile/billing', authenticate, controller.updateBilling);

// Get user by ID
router.get('/:id', controller.getUserById);

// Create user (admin only, with optional avatar)
router.post(
  '/',
  uploadAvatar,
  authenticate,
  authorize('admin', 'super_admin'),
  controller.createUser
);

// Update user (with optional avatar)
router.put(
  '/:id',
  uploadAvatar,
  authenticate,
  authorize('admin', 'super_admin'),
  controller.updateUser
);

// Delete user (admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'super_admin'),
  controller.deleteUser
);

export default router;
