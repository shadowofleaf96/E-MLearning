import { useState, useEffect } from 'react';
import { superAdminService } from '../services/superAdmin.service';

export interface SuperAdminStats {
  totalTenants: number;
  totalActiveUsers: number;
  totalRevenue: number;
  revenueTrend: { month: string; value: number }[];
  tenantGrowthTrend: { month: string; value: number }[];
  infraHealth: string;
  activeNode: string;
  serverLoad: {
    cpu: number;
    ram: number;
    storage: string;
    storagePercent: number;
  };
  activeLiveSessions: number;
  subscriptionTiers: {
    enterprise: number;
    pro: number;
    starter: number;
    total: number;
  };
  recentEvents: {
    id: string;
    type: string;
    title: string;
    desc: string;
    time: string;
  }[];
}

export function useSuperAdminStats() {
  const [stats, setStats] = useState<SuperAdminStats>({
    totalTenants: 0,
    totalActiveUsers: 0,
    totalRevenue: 0,
    revenueTrend: [],
    tenantGrowthTrend: [],
    infraHealth: '0%',
    activeNode: 'Unknown',
    serverLoad: {
      cpu: 0,
      ram: 0,
      storage: '0 TB',
      storagePercent: 0,
    },
    activeLiveSessions: 0,
    subscriptionTiers: {
      enterprise: 0,
      pro: 0,
      starter: 0,
      total: 0,
    },
    recentEvents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await superAdminService.getStats();
        if (isMounted && data) {
          setStats(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch super admin stats');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    ...stats,
    loading,
    error,
  };
}
