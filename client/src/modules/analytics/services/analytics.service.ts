import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export interface TimelineData {
  date: string;
  value: number;
}

export interface ModuleDistribution {
  label: string;
  percentage: number;
  hasInsight?: boolean;
}

export interface CoursePerformance {
  id: string;
  title: string;
  icon: string;
  enrolled: number;
  completionRate: number;
  avgScore: number;
  status: 'Healthy' | 'Review' | 'At Risk';
}

export interface InsightItem {
  id: string;
  type: 'error' | 'success' | 'warning';
  title: string;
  description: string;
  timestamp: string;
}

export interface InstructorAnalyticsData {
  avgCompletionRate: number;
  dailyActiveLearners: number;
  avgExamScore: number;
  totalLearningHours: number;
  activeLearnersTimeline: TimelineData[];
  moduleCompletionDistribution: ModuleDistribution[];
  coursePerformance: CoursePerformance[];
  insights: InsightItem[];
}

export const analyticsService = {
  async getInstructorAnalytics(): Promise<
    ApiResponse<InstructorAnalyticsData>
  > {
    const response = await api.get(ENDPOINTS.ANALYTICS.INSTRUCTOR);
    return response.data;
  },
};
