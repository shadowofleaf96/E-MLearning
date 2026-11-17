import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';

export interface StudentKpis {
  totalEnrolled: number;
  completedCourses: number;
  inProgressCourses: number;
  totalLessonsCompleted: number;
  totalStudyHours: number;
  totalStudyMinutes: number;
  avgExamScore: number;
  examsPassedCount: number;
  streak: number;
  xp: number;
  level: number;
}

export interface WeeklyActivityDay {
  date: string;
  day: string;
  minutes: number;
  lessons: number;
}

export interface CategoryMasteryItem {
  category: string;
  courseCount: number;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
}

export interface RecentExamAttempt {
  id: string;
  examTitle: string;
  score: number;
  passingScore: number;
  passed: boolean;
  date: string;
}

export interface StudentAnalyticsData {
  kpis: StudentKpis;
  weeklyActivity: WeeklyActivityDay[];
  categoryMastery: CategoryMasteryItem[];
  recentExams: RecentExamAttempt[];
}

export const analyticsService = {
  async getStudentAnalytics(): Promise<StudentAnalyticsData> {
    const res = await api.get(ENDPOINTS.ANALYTICS.STUDENT);
    return res.data.data;
  },
};
