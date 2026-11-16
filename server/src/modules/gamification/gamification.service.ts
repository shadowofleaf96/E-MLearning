import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';
import { BadgeTriggerType } from '@prisma/client';

export const gamificationService = {
  // ─── User Stats ────────────────────────────────────────────
  async getUserStats(userId: string, tenantId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId },
      select: { xp: true, level: true, streak: true },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    const earnedBadges = await prisma.userBadge.findMany({
      where: { userId, tenantId },
      include: {
        badge: {
          select: {
            id: true,
            title: true,
            description: true,
            icon: true,
            color: true,
            triggerType: true,
            triggerValue: true,
            courseId: true,
          },
        },
      },
      orderBy: { earnedAt: 'desc' },
    });

    return {
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      badges: earnedBadges.map((ub) => ({
        id: ub.badge.id,
        title: ub.badge.title,
        description: ub.badge.description,
        icon: ub.badge.icon,
        color: ub.badge.color,
        triggerType: ub.badge.triggerType,
        courseId: ub.badge.courseId,
        earnedAt: ub.earnedAt,
      })),
    };
  },

  // ─── Daily Bonus ───────────────────────────────────────────
  async claimDailyBonus(userId: string, tenantId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    const currentXp = user.xp ?? 0;
    const currentStreak = user.streak ?? 0;
    const bonusXp = 100; // Default daily bonus
    const newXp = currentXp + bonusXp;
    const newStreak = currentStreak + 1;
    const newLevel = Math.floor(newXp / 1000) + 1;

    await prisma.user.update({
      where: { id: userId },
      data: { xp: newXp, streak: newStreak, level: newLevel },
    });

    // Check streak badges across all enrolled courses
    await this.checkStreakBadges(userId, tenantId, newStreak);

    return {
      xp: newXp,
      level: newLevel,
      streak: newStreak,
    };
  },

  // ─── Award XP ──────────────────────────────────────────────
  async awardXp(
    userId: string,
    tenantId: string,
    amount: number,
    courseId?: string
  ) {
    const user = await prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!user) return;

    const newXp = (user.xp ?? 0) + amount;
    const newLevel = Math.floor(newXp / 1000) + 1;

    await prisma.user.update({
      where: { id: userId },
      data: { xp: newXp, level: newLevel },
    });

    // Check XP threshold badges
    if (courseId) {
      await this.checkXpBadges(userId, tenantId, courseId, newXp);
    }

    return { xp: newXp, level: newLevel };
  },

  // ─── Get XP Config for a Course ────────────────────────────
  async getXpConfig(courseId: string) {
    const config = await prisma.courseXpConfig.findUnique({
      where: { courseId },
    });

    return (
      config || {
        moduleCompletionXp: 100,
        courseCompletionXp: 500,
        examPassXp: 200,
        dailyBonusXp: 100,
      }
    );
  },

  // ─── Update XP Config ──────────────────────────────────────
  async upsertXpConfig(
    courseId: string,
    tenantId: string,
    data: {
      moduleCompletionXp?: number;
      courseCompletionXp?: number;
      examPassXp?: number;
      dailyBonusXp?: number;
    }
  ) {
    return prisma.courseXpConfig.upsert({
      where: { courseId },
      update: data,
      create: {
        courseId,
        tenantId,
        ...data,
      },
    });
  },

  // ─── Badge CRUD ────────────────────────────────────────────
  async createBadge(
    courseId: string,
    tenantId: string,
    data: {
      title: string;
      description?: string;
      icon: string;
      color: string;
      triggerType: BadgeTriggerType;
      triggerValue: number;
    }
  ) {
    return prisma.badge.create({
      data: {
        courseId,
        tenantId,
        title: data.title,
        description: data.description,
        icon: data.icon,
        color: data.color,
        triggerType: data.triggerType,
        triggerValue: data.triggerValue,
      },
    });
  },

  async updateBadge(
    badgeId: string,
    data: {
      title?: string;
      description?: string;
      icon?: string;
      color?: string;
      triggerType?: BadgeTriggerType;
      triggerValue?: number;
    }
  ) {
    return prisma.badge.update({
      where: { id: badgeId },
      data,
    });
  },

  async deleteBadge(badgeId: string) {
    return prisma.badge.delete({
      where: { id: badgeId },
    });
  },

  async getCourseBadges(courseId: string) {
    return prisma.badge.findMany({
      where: { courseId },
      orderBy: { createdAt: 'asc' },
    });
  },

  async getEarnedBadges(userId: string, tenantId: string) {
    const earned = await prisma.userBadge.findMany({
      where: { userId, tenantId },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: 'desc' },
    });
    return earned.map((ub) => ({
      ...ub.badge,
      earnedAt: ub.earnedAt,
    }));
  },

  // ─── Badge Checking Logic ──────────────────────────────────

  async checkAndAwardBadges(
    userId: string,
    tenantId: string,
    courseId: string,
    event: BadgeTriggerType,
    eventValue: number
  ) {
    const badges = await prisma.badge.findMany({
      where: { courseId, triggerType: event },
    });

    for (const badge of badges) {
      if (eventValue >= badge.triggerValue) {
        // Only award if not already earned
        const existing = await prisma.userBadge.findUnique({
          where: { userId_badgeId: { userId, badgeId: badge.id } },
        });
        if (!existing) {
          await prisma.userBadge.create({
            data: {
              userId,
              badgeId: badge.id,
              tenantId,
            },
          });
        }
      }
    }
  },

  async checkXpBadges(
    userId: string,
    tenantId: string,
    courseId: string,
    currentXp: number
  ) {
    await this.checkAndAwardBadges(
      userId,
      tenantId,
      courseId,
      'xp_threshold' as BadgeTriggerType,
      currentXp
    );
  },

  async checkStreakBadges(
    userId: string,
    tenantId: string,
    currentStreak: number
  ) {
    // Check streak badges across all courses the student is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId },
      select: { courseId: true },
    });

    for (const enrollment of enrollments) {
      await this.checkAndAwardBadges(
        userId,
        tenantId,
        enrollment.courseId,
        'streak_milestone' as BadgeTriggerType,
        currentStreak
      );
    }
  },

  async checkModuleCompletionBadges(
    userId: string,
    tenantId: string,
    courseId: string,
    completedModuleCount: number
  ) {
    await this.checkAndAwardBadges(
      userId,
      tenantId,
      courseId,
      'module_completion' as BadgeTriggerType,
      completedModuleCount
    );
  },

  async checkCourseCompletionBadges(
    userId: string,
    tenantId: string,
    courseId: string
  ) {
    // For course completion, triggerValue = 1 means "course is completed"
    await this.checkAndAwardBadges(
      userId,
      tenantId,
      courseId,
      'course_completion' as BadgeTriggerType,
      1
    );
  },

  async checkExamPassBadges(
    userId: string,
    tenantId: string,
    courseId: string,
    score: number
  ) {
    await this.checkAndAwardBadges(
      userId,
      tenantId,
      courseId,
      'exam_pass' as BadgeTriggerType,
      score
    );
  },
};
