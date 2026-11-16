import { Router } from 'express';
import * as controller from './payments.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
const router = Router();
router.get('/', authenticate, controller.getPayments);
router.get(
  '/admin/payout-requests',
  authenticate,
  authorize('admin', 'super_admin'),
  controller.getAllPayoutRequests
);
router.put(
  '/admin/payout-requests/:id/status',
  authenticate,
  authorize('admin', 'super_admin'),
  controller.updatePayoutStatus
);
router.get(
  '/admin/analytics',
  authenticate,
  authorize('admin', 'super_admin'),
  controller.getPaymentAnalytics
);
router.post('/initiate', authenticate, controller.initiatePayment);
router.post('/webhook', controller.handleWebhook);
router.post(
  '/create-subscription-session',
  authenticate,
  controller.createSubscriptionSession
);
router.post(
  '/customer-portal',
  authenticate,
  controller.createCustomerPortalSession
);
router.get('/tenant/billing', authenticate, controller.getTenantBilling);
router.get(
  '/student/history',
  authenticate,
  controller.getStudentPaymentHistory
);
router.get(
  '/instructor/earnings',
  authenticate,
  controller.getInstructorEarnings
);
router.post('/payouts/request', authenticate, controller.requestPayout);
router.get('/payouts', authenticate, controller.getPayoutHistory);
router.get('/:id', authenticate, controller.getPaymentById);
export default router;
