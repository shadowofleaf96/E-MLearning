'use client';

import { useState, useCallback } from 'react';
import { progressService, ModuleProgress } from '../services/progress.service';

export function useProgress() {
  const [progresses, setProgresses] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await progressService.getProgress(courseId);
      setProgresses(res.data);
      return { success: true, data: res.data };
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to load progress';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(
    async (moduleId: string, percentage: number) => {
      try {
        const res = await progressService.updateProgress(moduleId, percentage);
        setProgresses((prev) =>
          prev.map((p) => (p.moduleId === moduleId ? res.data : p))
        );
        return { success: true, data: res.data };
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message || 'Failed to update progress';
        return { success: false, error: errMsg };
      }
    },
    []
  );

  return {
    progresses,
    loading,
    error,
    fetchProgress,
    updateProgress,
  };
}
