import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

export interface PlanConfig {
  name: string;
  price: number | string;
  activeTenants: number;
  mrr: number;
  studentCapacity: number | string;
  storageGb: number;
  codingChallenges: boolean;
  whiteLabeling: boolean;
  apiAccess: boolean;
}

export interface SaaSPlansData {
  totalTenants: number;
  plans: {
    starter: PlanConfig;
    pro: PlanConfig;
    enterprise: PlanConfig;
  };
  stats: {
    totalTenants: number;
    starterMrr: number;
    proMrr: number;
    enterpriseMrr: number;
  };
}

export function useSaaSPlans() {
  const [data, setData] = useState<SaaSPlansData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/super-admin/plans');
      setData(response.data.data);
      setLoading(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to fetch SaaS plans'
      );
      setLoading(false);
    }
  }, []);

  const savePlanConfigs = async (updatedConfigs: any) => {
    try {
      const response = await api.put('/super-admin/plans', updatedConfigs);
      await fetchPlans();
      return response.data;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          'Failed to save plan configurations'
      );
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    data,
    loading,
    error,
    refresh: fetchPlans,
    savePlanConfigs,
  };
}
