import { useState, useEffect } from 'react';
import api from '@/services/api';

interface AdminStats {
  totalRevenue: number;
  totalEnrollments: number;
  dailyActive: number;
  totalInstructors: number;
  avgCourseCompletion: number;
  enrollmentTrends: { month: string; value: number }[];
  revenueTrends: { month: string; value: number }[];
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalRevenue: 0,
    totalEnrollments: 0,
    dailyActive: 0,
    totalInstructors: 0,
    avgCourseCompletion: 0,
    enrollmentTrends: [],
    revenueTrends: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Using the existing getAdminAnalytics route
        let url = '/analytics/admin';
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const tenantId = urlParams.get('tenantId');
          if (tenantId) {
            url += `?tenantId=${tenantId}`;
          }
        }
        const res = await api.get(url);
        if (isMounted && res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch admin stats');
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
