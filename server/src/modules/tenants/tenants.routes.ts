import { Router } from 'express';
import * as controller from './tenants.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

const router = Router();

// Public route to resolve tenant by domain/slug for branding/UI
router.get('/resolve', controller.resolveTenant);

// Route for users to get their own tenant details
router.get('/current', authenticate, controller.getCurrentTenant);

// Administrative routes (protected by super_admin role)
router.get(
  '/',
  authenticate,
  authorize('super_admin'),
  controller.getAllTenants
);
router.get(
  '/:id',
  authenticate,
  authorize('super_admin'),
  controller.getTenantById
);
router.post(
  '/',
  authenticate,
  authorize('super_admin'),
  controller.createTenant
);
router.put(
  '/:id',
  authenticate,
  authorize('super_admin'),
  controller.updateTenant
);
router.put(
  '/:id/theme',
  authenticate,
  authorize('super_admin', 'admin'),
  controller.updateTheme
);
router.put(
  '/:id/notifications',
  authenticate,
  authorize('super_admin', 'admin'),
  controller.updateNotificationSettings
);
router.delete(
  '/:id',
  authenticate,
  authorize('super_admin'),
  controller.deleteTenant
);

export default router;
