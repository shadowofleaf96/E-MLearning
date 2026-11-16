import { Router } from 'express';
import * as controller from './auth.controller';
import { authenticate } from '../../middlewares/authenticate';
import { uploadAvatar } from '../../middlewares/upload';
import { validateRequest } from '../../middlewares/validateRequest';
import { authSchemas } from './auth.validator';

const router = Router();

/**
 * Auth Routes
 * Base path: /api/auth
 * Restored from original boilerplate userRoutes.ts (auth-related routes).
 */

// Register a new user (with optional avatar upload)
router.post('/register', uploadAvatar, controller.register);

// Login with credentials
router.post('/login', controller.login);

// Login with Google OAuth
router.post('/google', controller.googleAuth);
router.post('/logout', controller.logout);
router.post('/refresh-token', controller.refreshToken);
router.put('/change-password', authenticate, controller.changePassword);

// 2FA Routes
router.post('/verify-2fa-login', controller.verify2FALogin);
router.post('/2fa/enable', authenticate, controller.enable2FA);
router.post('/2fa/verify', authenticate, controller.verify2FASetup);
router.post('/2fa/disable', authenticate, controller.disable2FA);

// Request password reset
router.post('/forgot-password', controller.forgotPassword);

// Reset password with token
router.put('/reset-password/:token', controller.resetPassword);

// Verify email address
router.get('/verify-email/:token', controller.verifyEmail);

// Find all institutes associated with an email
router.post(
  '/find-institutes',
  validateRequest({ body: authSchemas.findInstitutes }),
  controller.findInstitutes
);

export default router;
