import { useState, useEffect, useCallback } from 'react';
import { superAdminService } from '../services/superAdmin.service';

export interface GlobalAnalyticsData {
  totalRevenue: number;
  activeLearners: number;
  completionRate: string;
  activeTenants: number;
  tiers: {
    enterprise: number;
    pro: number;
    starter: number;
    free: number;
  };
  monthlyTrends: Array<{
    m: string;
    revenue: number;
    enrollment: number;
  }>;
  topTenants: Array<{
    id: string;
    name: string;
    slug: string;
    subscriptionPlan: string;
    _count: {
      users: number;
      courses: number;
    };
  }>;
  regionalTelemetry: Array<{
    region: string;
    pct: string;
    count: string;
    top: string;
    left: string;
  }>;
  totalNodes: number;
}

export interface GlobalAnalyticsState {
  data: GlobalAnalyticsData | null;
  loading: boolean;
  error: string | null;
}

export function useGlobalAnalytics(initialRange = 'Year to Date') {
  const [range, setRange] = useState(initialRange);
  const [state, setState] = useState<GlobalAnalyticsState>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchAnalytics = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await superAdminService.getGlobalAnalytics(range);
      setState({
        data,
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
          'Failed to fetch global analytics',
      });
    }
  }, [range]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    ...state,
    range,
    setRange,
    refresh: fetchAnalytics,
  };
}
