import api from '@/services/api';
import { ENDPOINTS } from '@/services/endpoints';
import { ApiResponse } from '@/types/api.types';

export interface BadgeData {
  id: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  triggerType: string;
  triggerValue: number;
  courseId: string;
  earnedAt?: string;
  createdAt?: string;
}

export interface XpConfig {
  moduleCompletionXp: number;
  courseCompletionXp: number;
  examPassXp: number;
  dailyBonusXp: number;
}

export interface GamificationStats {
  xp: number;
  level: number;
  streak: number;
  badges: BadgeData[];
  goals?: any[];
  milestones?: any[];
}

export const gamificationService = {
  async getUserStats(): Promise<ApiResponse<GamificationStats>> {
    const response = await api.get(ENDPOINTS.GAMIFICATION.STATS);
    return response.data;
  },

  async claimDailyBonus(): Promise<ApiResponse<GamificationStats>> {
    const response = await api.post(ENDPOINTS.GAMIFICATION.CLAIM_DAILY);
    return response.data;
  },

  // ─── Badges ──────────────────────────────────────────────
  async getEarnedBadges(): Promise<ApiResponse<BadgeData[]>> {
    const response = await api.get(ENDPOINTS.GAMIFICATION.EARNED_BADGES);
    return response.data;
  },

  async getCourseBadges(courseId: string): Promise<ApiResponse<BadgeData[]>> {
    const response = await api.get(
      ENDPOINTS.GAMIFICATION.COURSE_BADGES(courseId)
    );
    return response.data;
  },

  async createBadge(
    courseId: string,
    data: Partial<BadgeData>
  ): Promise<ApiResponse<BadgeData>> {
    const response = await api.post(
      ENDPOINTS.GAMIFICATION.CREATE_BADGE(courseId),
      data
    );
    return response.data;
  },

  async updateBadge(
    badgeId: string,
    data: Partial<BadgeData>
  ): Promise<ApiResponse<BadgeData>> {
    const response = await api.put(
      ENDPOINTS.GAMIFICATION.UPDATE_BADGE(badgeId),
      data
    );
    return response.data;
  },

  async deleteBadge(badgeId: string): Promise<ApiResponse<void>> {
    const response = await api.delete(
      ENDPOINTS.GAMIFICATION.DELETE_BADGE(badgeId)
    );
    return response.data;
  },

  // ─── XP Config ───────────────────────────────────────────
  async getXpConfig(courseId: string): Promise<ApiResponse<XpConfig>> {
    const response = await api.get(ENDPOINTS.GAMIFICATION.XP_CONFIG(courseId));
    return response.data;
  },

  async updateXpConfig(
    courseId: string,
    data: Partial<XpConfig>
  ): Promise<ApiResponse<XpConfig>> {
    const response = await api.put(
      ENDPOINTS.GAMIFICATION.XP_CONFIG(courseId),
      data
    );
    return response.data;
  },
};
