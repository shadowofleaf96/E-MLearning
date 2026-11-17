import { useState, useEffect, useCallback } from 'react';
import { superAdminService } from '../services/superAdmin.service';

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
      const plans = await superAdminService.getSaaSPlans();
      setData(plans);
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
      const res = await superAdminService.updateSaaSPlans(updatedConfigs);
      await fetchPlans();
      return res;
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
