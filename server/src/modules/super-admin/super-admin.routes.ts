import { Router } from 'express';
import * as controller from './super-admin.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

const router = Router();

// Dashboard analytics for Super Admin (global scope)
router.get(
  '/stats',
  authenticate,
  authorize('super_admin'),
  controller.getPlatformStats
);

// Tenant Management
router.get(
  '/tenants',
  authenticate,
  authorize('super_admin'),
  controller.getAllTenants
);

router.post(
  '/tenants',
  authenticate,
  authorize('super_admin'),
  controller.createTenant
);

router.get(
  '/tenants/:id',
  authenticate,
  authorize('super_admin'),
  controller.getTenantById
);

router.put(
  '/tenants/:id',
  authenticate,
  authorize('super_admin'),
  controller.updateTenant
);

router.delete(
  '/tenants/:id',
  authenticate,
  authorize('super_admin'),
  controller.deleteTenant
);

router.patch(
  '/tenants/:id/status',
  authenticate,
  authorize('super_admin'),
  controller.updateTenantStatus
);

router.patch(
  '/tenants/:id/subscription',
  authenticate,
  authorize('super_admin'),
  controller.updateTenantSubscription
);

// Platform User Management
router.get(
  '/users',
  authenticate,
  authorize('super_admin'),
  controller.getAllUsers
);

router.patch(
  '/users/:id/role',
  authenticate,
  authorize('super_admin'),
  controller.updateUserRole
);

router.patch(
  '/users/:id/status',
  authenticate,
  authorize('super_admin'),
  controller.updateUserStatus
);

// Global Analytics
router.get(
  '/analytics',
  authenticate,
  authorize('super_admin'),
  controller.getGlobalAnalytics
);

// SaaS Plans Management
router.get(
  '/plans',
  authenticate,
  authorize('super_admin'),
  controller.getSaaSPlans
);

router.put(
  '/plans',
  authenticate,
  authorize('super_admin'),
  controller.updateSaaSPlans
);

// Platform Security & Perimeter Operations
router.get(
  '/security',
  authenticate,
  authorize('super_admin'),
  controller.getSecurityOverview
);

router.put(
  '/security/settings',
  authenticate,
  authorize('super_admin'),
  controller.updateSecuritySettings
);

router.post(
  '/security/scan',
  authenticate,
  authorize('super_admin'),
  controller.triggerPerimeterScan
);

router.post(
  '/security/blacklist',
  authenticate,
  authorize('super_admin'),
  controller.blacklistIp
);

router.post(
  '/security/resolve-incident',
  authenticate,
  authorize('super_admin'),
  controller.resolveIncident
);

export default router;
