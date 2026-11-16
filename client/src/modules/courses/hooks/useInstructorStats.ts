import { useState, useEffect } from 'react';
import { useCourses } from './useCourses';
import api from '@/services/api';

export function useInstructorStats() {
  const {
    courses,
    loading: coursesLoading,
    error: coursesError,
    loadCourses,
  } = useCourses();

  const [totalStudents, setTotalStudents] = useState(0);
  const [avgCompletion, setAvgCompletion] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchRealStats = async () => {
      try {
        setLoadingStats(true);
        const [analyticsRes, earningsRes] = await Promise.all([
          api.get('/analytics/instructor'),
          api.get('/payments/instructor/earnings'),
        ]);

        const analyticsData = analyticsRes.data?.data;
        const earningsData = earningsRes.data?.data;

        // Sum enrolled from coursePerformance list
        const totalEnrolled =
          analyticsData?.coursePerformance?.reduce(
            (acc: number, c: any) => acc + (c.enrolled || 0),
            0
          ) || 0;

        setTotalStudents(totalEnrolled);
        setAvgCompletion(analyticsData?.avgCompletionRate || 0);
        setTotalEarnings(earningsData?.totalEarnings || 0);
      } catch (err) {
        console.error('Failed to fetch real instructor stats', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchRealStats();
    loadCourses();
  }, [loadCourses]);

  const instructorCourses = courses || [];
  const activeCourses = instructorCourses.filter((c) => c.isPublished).length;

  return {
    totalStudents,
    activeCourses,
    avgCompletion,
    totalEarnings,
    recentCourses: instructorCourses.slice(0, 5),
    instructorCourses,
    loading: coursesLoading || loadingStats,
    error: coursesError,
  };
}
