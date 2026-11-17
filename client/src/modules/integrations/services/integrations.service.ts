import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface ApiKey {
  id: string;
  name: string;
  key?: string;
  maskedKey: string;
  scopes: string[];
  isActive: boolean;
  lastUsedAt?: string | null;
  createdAt: string;
  plainKey?: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  statusCode: number | null;
  responseBody: string | null;
  success: boolean;
  deliveredAt: string;
}

export interface Webhook {
  id: string;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
  lastTriggeredAt?: string | null;
  failureCount: number;
  createdAt: string;
  deliveries?: WebhookDelivery[];
}

export const integrationsService = {
  async getApiKeys(): Promise<ApiKey[]> {
    const res = await api.get(ENDPOINTS.INTEGRATIONS.API_KEYS);
    return res.data.data;
  },

  async createApiKey(data: {
    name: string;
    scopes: string[];
  }): Promise<ApiKey> {
    const res = await api.post(ENDPOINTS.INTEGRATIONS.CREATE_API_KEY, data);
    return res.data.data;
  },

  async revokeApiKey(id: string): Promise<void> {
    await api.delete(ENDPOINTS.INTEGRATIONS.REVOKE_API_KEY(id));
  },

  async getWebhooks(): Promise<Webhook[]> {
    const res = await api.get(ENDPOINTS.INTEGRATIONS.WEBHOOKS);
    return res.data.data;
  },

  async createWebhook(data: {
    url: string;
    events: string[];
  }): Promise<Webhook> {
    const res = await api.post(ENDPOINTS.INTEGRATIONS.CREATE_WEBHOOK, data);
    return res.data.data;
  },

  async updateWebhook(
    id: string,
    data: { url?: string; events?: string[]; isActive?: boolean }
  ): Promise<void> {
    await api.put(ENDPOINTS.INTEGRATIONS.UPDATE_WEBHOOK(id), data);
  },

  async deleteWebhook(id: string): Promise<void> {
    await api.delete(ENDPOINTS.INTEGRATIONS.DELETE_WEBHOOK(id));
  },

  async testWebhook(id: string): Promise<WebhookDelivery> {
    const res = await api.post(ENDPOINTS.INTEGRATIONS.TEST_WEBHOOK(id));
    return res.data.data;
  },

  async getDeliveries(id: string): Promise<WebhookDelivery[]> {
    const res = await api.get(ENDPOINTS.INTEGRATIONS.WEBHOOK_DELIVERIES(id));
    return res.data.data;
  },
};
