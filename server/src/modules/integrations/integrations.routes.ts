import { Router } from 'express';
import { integrationsController } from './integrations.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { UserRole } from '@prisma/client';

const router = Router();

// Protect all integration endpoints with admin / super_admin
router.use(authenticate, authorize(UserRole.admin, UserRole.super_admin));

// API Keys
router.get('/api-keys', integrationsController.getApiKeys);
router.post('/api-keys', integrationsController.createApiKey);
router.delete('/api-keys/:id', integrationsController.revokeApiKey);

// Webhooks
router.get('/webhooks', integrationsController.getWebhooks);
router.post('/webhooks', integrationsController.createWebhook);
router.put('/webhooks/:id', integrationsController.updateWebhook);
router.delete('/webhooks/:id', integrationsController.deleteWebhook);
router.post('/webhooks/:id/test', integrationsController.testWebhook);
router.get(
  '/webhooks/:id/deliveries',
  integrationsController.getWebhookDeliveries
);

export default router;
