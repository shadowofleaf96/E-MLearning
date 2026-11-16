import { Router } from 'express';
import * as controller from './gamification.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

const router = Router();

// ─── Student Endpoints ──────────────────────────────────────
router.get('/stats', authenticate, controller.getUserStats);
router.post('/claim-daily', authenticate, controller.claimDailyBonus);
router.get('/badges/earned', authenticate, controller.getEarnedBadges);
router.get(
  '/badges/course/:courseId',
  authenticate,
  controller.getCourseBadges
);

// ─── Instructor Endpoints ───────────────────────────────────
router.post(
  '/badges/course/:courseId',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.createBadge
);
router.put(
  '/badges/:badgeId',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.updateBadge
);
router.delete(
  '/badges/:badgeId',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.deleteBadge
);
router.get('/xp-config/:courseId', authenticate, controller.getXpConfig);
router.put(
  '/xp-config/:courseId',
  authenticate,
  authorize('instructor', 'admin', 'super_admin'),
  controller.updateXpConfig
);

export default router;
