import crypto from 'crypto';
import axios from 'axios';
import prisma from '../../shared/database/prisma';
import {
  CreateApiKeyDto,
  CreateWebhookDto,
  UpdateWebhookDto,
  AVAILABLE_SCOPES,
  AVAILABLE_WEBHOOK_EVENTS,
} from './integrations.types';

export const integrationsService = {
  // ─── API Keys ───────────────────────────────────────────────

  async getApiKeys(tenantId: string) {
    const keys = await prisma.apiKey.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        key: true,
        scopes: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
      },
    });

    // Mask keys except prefix and last 4 characters for security in list view
    return keys.map((k) => ({
      ...k,
      maskedKey:
        k.key.length > 16
          ? `${k.key.slice(0, 12)}••••••••${k.key.slice(-4)}`
          : '••••••••',
    }));
  },

  async createApiKey(tenantId: string, data: CreateApiKeyDto) {
    const rawRandom = crypto.randomBytes(24).toString('hex');
    const fullKey = `lms_live_${rawRandom}`;

    const validScopes = data.scopes && data.scopes.length > 0
      ? data.scopes.filter((s) => AVAILABLE_SCOPES.includes(s as any))
      : ['read:courses', 'read:users', 'write:enrollments'];

    const apiKey = await prisma.apiKey.create({
      data: {
        tenantId,
        name: data.name,
        key: fullKey,
        scopes: validScopes,
        isActive: true,
      },
    });

    return {
      ...apiKey,
      plainKey: fullKey, // Revealed only once upon creation
    };
  },

  async revokeApiKey(tenantId: string, keyId: string) {
    return prisma.apiKey.deleteMany({
      where: { id: keyId, tenantId },
    });
  },

  // ─── Webhooks ───────────────────────────────────────────────

  async getWebhooks(tenantId: string) {
    return prisma.webhook.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      include: {
        deliveries: {
          take: 5,
          orderBy: { deliveredAt: 'desc' },
        },
      },
    });
  },

  async createWebhook(tenantId: string, data: CreateWebhookDto) {
    const secret = `whsec_${crypto.randomBytes(20).toString('hex')}`;
    const validEvents = data.events && data.events.length > 0
      ? data.events.filter((e) => AVAILABLE_WEBHOOK_EVENTS.includes(e as any))
      : ['course.created', 'enrollment.created'];

    return prisma.webhook.create({
      data: {
        tenantId,
        url: data.url,
        secret,
        events: validEvents,
        isActive: true,
      },
    });
  },

  async updateWebhook(tenantId: string, webhookId: string, data: UpdateWebhookDto) {
    return prisma.webhook.updateMany({
      where: { id: webhookId, tenantId },
      data: {
        ...(data.url ? { url: data.url } : {}),
        ...(data.events ? { events: data.events } : {}),
        ...(typeof data.isActive === 'boolean' ? { isActive: data.isActive } : {}),
      },
    });
  },

  async deleteWebhook(tenantId: string, webhookId: string) {
    return prisma.webhook.deleteMany({
      where: { id: webhookId, tenantId },
    });
  },

  async getWebhookDeliveries(tenantId: string, webhookId: string) {
    const webhook = await prisma.webhook.findFirst({
      where: { id: webhookId, tenantId },
    });
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    return prisma.webhookDelivery.findMany({
      where: { webhookId },
      orderBy: { deliveredAt: 'desc' },
      take: 20,
    });
  },

  async testWebhook(tenantId: string, webhookId: string) {
    const webhook = await prisma.webhook.findFirst({
      where: { id: webhookId, tenantId },
    });
    if (!webhook) {
      throw new Error('Webhook not found');
    }

    const testPayload = {
      event: 'ping',
      timestamp: new Date().toISOString(),
      tenantId,
      data: {
        message: 'This is a test webhook payload from E-Tactiques LMS.',
        webhookId: webhook.id,
      },
    };

    const signature = crypto
      .createHmac('sha256', webhook.secret)
      .update(JSON.stringify(testPayload))
      .digest('hex');

    let statusCode: number | null = null;
    let responseBody: string | null = null;
    let success = false;

    try {
      const res = await axios.post(webhook.url, testPayload, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'E-Tactiques-LMS-Webhooks/1.0',
          'X-LMS-Signature': `sha256=${signature}`,
          'X-LMS-Event': 'ping',
        },
        timeout: 5000,
      });
      statusCode = res.status;
      responseBody = typeof res.data === 'string' ? res.data.slice(0, 500) : JSON.stringify(res.data).slice(0, 500);
      success = res.status >= 200 && res.status < 300;
    } catch (err: any) {
      statusCode = err.response?.status || 500;
      responseBody = err.response?.data
        ? (typeof err.response.data === 'string' ? err.response.data.slice(0, 500) : JSON.stringify(err.response.data).slice(0, 500))
        : err.message;
      success = false;
    }

    const delivery = await prisma.webhookDelivery.create({
      data: {
        webhookId: webhook.id,
        event: 'ping',
        payload: testPayload,
        statusCode,
        responseBody,
        success,
      },
    });

    await prisma.webhook.update({
      where: { id: webhook.id },
      data: {
        lastTriggeredAt: new Date(),
        failureCount: success ? 0 : { increment: 1 },
      },
    });

    return delivery;
  },

  async dispatchWebhookEvent(tenantId: string, event: string, data: any) {
    try {
      const webhooks = await prisma.webhook.findMany({
        where: {
          tenantId,
          isActive: true,
          events: { has: event },
        },
      });

      if (webhooks.length === 0) return;

      const payload = {
        event,
        timestamp: new Date().toISOString(),
        tenantId,
        data,
      };

      for (const webhook of webhooks) {
        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(JSON.stringify(payload))
          .digest('hex');

        axios
          .post(webhook.url, payload, {
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'E-Tactiques-LMS-Webhooks/1.0',
              'X-LMS-Signature': `sha256=${signature}`,
              'X-LMS-Event': event,
            },
            timeout: 5000,
          })
          .then(async (res) => {
            const success = res.status >= 200 && res.status < 300;
            await prisma.webhookDelivery.create({
              data: {
                webhookId: webhook.id,
                event,
                payload,
                statusCode: res.status,
                responseBody: JSON.stringify(res.data).slice(0, 500),
                success,
              },
            });
            await prisma.webhook.update({
              where: { id: webhook.id },
              data: {
                lastTriggeredAt: new Date(),
                failureCount: 0,
              },
            });
          })
          .catch(async (err) => {
            await prisma.webhookDelivery.create({
              data: {
                webhookId: webhook.id,
                event,
                payload,
                statusCode: err.response?.status || 500,
                responseBody: err.message,
                success: false,
              },
            });
            await prisma.webhook.update({
              where: { id: webhook.id },
              data: {
                lastTriggeredAt: new Date(),
                failureCount: { increment: 1 },
              },
            });
          });
      }
    } catch (err) {
      console.error('Failed to dispatch webhook event:', err);
    }
  },
};
