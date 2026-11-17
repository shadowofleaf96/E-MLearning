import api from '@/services/api';

export interface SuperAdminTenant {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  subscriptionPlan: 'free' | 'starter' | 'pro' | 'enterprise';
  isActive: boolean;
  createdAt: string;
  _count?: {
    users: number;
    courses?: number;
  };
}

export interface SuperAdminTenantsResponse {
  tenants: SuperAdminTenant[];
  total: number;
  mrr: number;
  page: number;
  totalPages: number;
}

export const superAdminService = {
  async getTenants(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<SuperAdminTenantsResponse> {
    const res = await api.get('/super-admin/tenants', { params });
    return res.data.data;
  },

  async getTenantById(id: string): Promise<SuperAdminTenant> {
    const res = await api.get(`/super-admin/tenants/${id}`);
    return res.data.data;
  },

  async createTenant(data: any): Promise<SuperAdminTenant> {
    const res = await api.post('/super-admin/tenants', data);
    return res.data.data;
  },

  async updateTenantSubscription(
    id: string,
    subscriptionPlan: string
  ): Promise<SuperAdminTenant> {
    const res = await api.patch(`/super-admin/tenants/${id}/subscription`, {
      subscriptionPlan,
    });
    return res.data.data;
  },

  async toggleTenantStatus(
    id: string,
    isActive: boolean
  ): Promise<SuperAdminTenant> {
    const res = await api.patch(`/super-admin/tenants/${id}/status`, {
      isActive,
    });
    return res.data.data;
  },

  async getStats() {
    const res = await api.get('/super-admin/stats');
    return res.data.data;
  },

  async getGlobalAnalytics(range: string = 'Year to Date') {
    const res = await api.get('/super-admin/analytics', { params: { range } });
    return res.data.data;
  },

  async getPlatformSecurity() {
    const res = await api.get('/super-admin/security');
    return res.data.data;
  },

  async triggerSecurityScan() {
    const res = await api.post('/super-admin/security/scan');
    return res.data.data;
  },

  async updateSecuritySettings(settings: any) {
    const res = await api.put('/super-admin/security/settings', settings);
    return res.data.data;
  },

  async blacklistIp(ip: string) {
    const res = await api.post('/super-admin/security/blacklist', { ip });
    return res.data.data;
  },

  async resolveSecurityIncident(incidentId: string) {
    const res = await api.post('/super-admin/security/resolve-incident', {
      incidentId,
    });
    return res.data.data;
  },

  async getPlatformUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const res = await api.get('/super-admin/users', { params });
    return res.data.data;
  },

  async updateUserRole(userId: string, role: string) {
    const res = await api.patch(`/super-admin/users/${userId}/role`, { role });
    return res.data.data;
  },

  async updateUserStatus(userId: string, status: string) {
    const res = await api.patch(`/super-admin/users/${userId}/status`, {
      status,
    });
    return res.data.data;
  },

  async getSaaSPlans() {
    const res = await api.get('/super-admin/plans');
    return res.data.data;
  },

  async updateSaaSPlan(id: string, data: any) {
    const res = await api.put(`/super-admin/plans/${id}`, data);
    return res.data.data;
  },

  async updateSaaSPlans(updatedConfigs: any) {
    const res = await api.put('/super-admin/plans', updatedConfigs);
    return res.data.data;
  },
};
