import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  subscriptionPlan: 'free' | 'starter' | 'pro' | 'enterprise';
  isActive: boolean;
  createdAt: string;
  _count?: {
    users: number;
  };
}

export interface TenantsResponse {
  tenants: Tenant[];
  total: number;
  mrr: number;
  page: number;
  totalPages: number;
}

export interface TenantsState {
  data: TenantsResponse | null;
  loading: boolean;
  error: string | null;
}

export function useTenants(initialPage = 1, initialLimit = 10) {
  const [state, setState] = useState<TenantsState>({
    data: null,
    loading: true,
    error: null,
  });

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [planFilter, setPlanFilter] = useState('All Plans');

  const fetchTenants = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.get('/super-admin/tenants', {
        params: { page, limit, search },
      });
      setState({
        data: response.data.data,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      setState({
        data: null,
        loading: false,
        error:
          err.response?.data?.message ||
          err.message ||
          'Failed to load tenants',
      });
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const createTenant = async (data: {
    name: string;
    domain: string;
    subscriptionPlan: string;
  }) => {
    try {
      // Auto-generate a unique slug from domain or name
      const slug = (data.domain || data.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      const response = await api.post('/super-admin/tenants', {
        ...data,
        slug,
      });
      await fetchTenants(); // Refresh list
      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || err.message || 'Failed to create tenant'
      );
    }
  };

  const toggleTenantStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/super-admin/tenants/${id}/status`, {
        isActive: !currentStatus,
      });
      await fetchTenants(); // Refresh list
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || err.message || 'Failed to update status'
      );
    }
  };

  const updateTenantSubscription = async (
    id: string,
    subscriptionPlan: string
  ) => {
    try {
      await api.patch(`/super-admin/tenants/${id}/subscription`, {
        subscriptionPlan,
      });
      await fetchTenants(); // Refresh list
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          'Failed to update subscription plan'
      );
    }
  };

  // Filter the tenants locally if the API doesn't support complex filtering yet
  // In a real production app, filtering should also happen via API query params.
  const filteredTenants =
    state.data?.tenants.filter((tenant) => {
      if (statusFilter !== 'All Status') {
        const isStatusActive = statusFilter === 'Active';
        if (tenant.isActive !== isStatusActive) return false;
      }
      if (planFilter !== 'All Plans') {
        if (tenant.subscriptionPlan.toLowerCase() !== planFilter.toLowerCase())
          return false;
      }
      return true;
    }) || [];

  return {
    ...state,
    filteredTenants,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    planFilter,
    setPlanFilter,
    refresh: fetchTenants,
    createTenant,
    toggleTenantStatus,
    updateTenantSubscription,
  };
}
