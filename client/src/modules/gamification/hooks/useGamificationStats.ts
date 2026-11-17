import { useState, useEffect } from 'react';
import api from '@/services/api';

export interface GamificationStats {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
}

export const useGamificationStats = () => {
  const [data, setData] = useState<GamificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/gamification/stats');
        setData(response.data.data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { data, isLoading, error };
};
