import { Request, Response } from 'express';
import { integrationsService } from './integrations.service';

export const integrationsController = {
  // API Keys
  async getApiKeys(req: Request, res: Response) {
    try {
      const tenantId = (req.user as any)?.tenantId || (req as any).tenantId;
      const keys = await integrationsService.getApiKeys(tenantId);
      res.status(200).json({ success: true, data: keys });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async createApiKey(req: Request, res: Response) {
    try {
      const tenantId = (req.user as any)?.tenantId || (req as any).tenantId;
      const { name, scopes } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Name is required' });
      }
      const key = await integrationsService.createApiKey(tenantId, { name, scopes });
      res.status(201).json({ success: true, data: key });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async revokeApiKey(req: Request, res: Response) {
    try {
      const tenantId = (req.user as any)?.tenantId || (req as any).tenantId;
      const { id } = req.params;
      const keyId = Array.isArray(id) ? id[0] : id;
      await integrationsService.revokeApiKey(tenantId, keyId);
      res.status(200).json({ success: true, message: 'API key revoked' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Webhooks
  async getWebhooks(req: Request, res: Response) {
    try {
      const tenantId = (req.user as any)?.tenantId || (req as any).tenantId;
      const webhooks = await integrationsService.getWebhooks(tenantId);
      res.status(200).json({ success: true, data: webhooks });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async createWebhook(req: Request, res: Response) {
    try {
      const tenantId = (req.user as any)?.tenantId || (req as any).tenantId;
      const { url, events } = req.body;
      if (!url) {
        return res.status(400).json({ success: false, message: 'Webhook URL is required' });
      }
      const webhook = await integrationsService.createWebhook(tenantId, { url, events });
      res.status(201).json({ success: true, data: webhook });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async updateWebhook(req: Request, res: Response) {
    try {
      const tenantId = (req.user as any)?.tenantId || (req as any).tenantId;
      const { id } = req.params;
      const webhookId = Array.isArray(id) ? id[0] : id;
      await integrationsService.updateWebhook(tenantId, webhookId, req.body);
      res.status(200).json({ success: true, message: 'Webhook updated' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async deleteWebhook(req: Request, res: Response) {
    try {
      const tenantId = (req.user as any)?.tenantId || (req as any).tenantId;
      const { id } = req.params;
      const webhookId = Array.isArray(id) ? id[0] : id;
      await integrationsService.deleteWebhook(tenantId, webhookId);
      res.status(200).json({ success: true, message: 'Webhook deleted' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async testWebhook(req: Request, res: Response) {
    try {
      const tenantId = (req.user as any)?.tenantId || (req as any).tenantId;
      const { id } = req.params;
      const webhookId = Array.isArray(id) ? id[0] : id;
      const delivery = await integrationsService.testWebhook(tenantId, webhookId);
      res.status(200).json({ success: true, data: delivery });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getWebhookDeliveries(req: Request, res: Response) {
    try {
      const tenantId = (req.user as any)?.tenantId || (req as any).tenantId;
      const { id } = req.params;
      const webhookId = Array.isArray(id) ? id[0] : id;
      const deliveries = await integrationsService.getWebhookDeliveries(tenantId, webhookId);
      res.status(200).json({ success: true, data: deliveries });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
