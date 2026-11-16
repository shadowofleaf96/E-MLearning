import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';
import { gamificationService } from '../gamification/gamification.service';

export const progressService = {
  async getStudentProgress(tenantId: string, studentId: string) {
    return prisma.studentProgress.findMany({
      where: { tenantId, studentId },
      include: {
        module: {
          select: { title: true, courseId: true, orderIndex: true },
        },
      },
    });
  },

  async getCourseProgress(
    tenantId: string,
    studentId: string,
    courseId: string
  ) {
    const modules = await prisma.module.findMany({
      where: { tenantId, courseId },
      orderBy: { orderIndex: 'asc' },
      include: {
        studentProgress: {
          where: { studentId },
        },
        lessons: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            title: true,
            type: true,
            duration: true,
            orderIndex: true,
          },
        },
      },
    });

    let previousModuleCompleted = true; // First module is unlocked

    const enrichedModules = modules.map((mod, index) => {
      const progress = mod.studentProgress[0];
      const isCompleted = progress?.completed || false;
      const progressPercentage = progress?.progressPercentage || 0;

      let isUnlocked = false;

      if (!mod.isLocked) {
        isUnlocked = true;
      } else if (index === 0) {
        isUnlocked = true;
      } else {
        isUnlocked = previousModuleCompleted;
      }

      // Update for next iteration
      previousModuleCompleted = isCompleted;

      return {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        orderIndex: mod.orderIndex,
        isLocked: mod.isLocked,
        isUnlocked,
        progress: {
          completed: isCompleted,
          progressPercentage,
        },
        lessons: mod.lessons,
      };
    });

    return enrichedModules;
  },

  async updateModuleProgress(
    tenantId: string,
    studentId: string,
    moduleId: string,
    data: { progressPercentage?: number; completed?: boolean }
  ) {
    const currentModule = await prisma.module.findUnique({
      where: { id: moduleId, tenantId },
      include: { course: true },
    });

    if (!currentModule) {
      throw new AppError('Module not found', 404);
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: currentModule.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new AppError('You are not enrolled in this course', 403);
    }

    // Enforce lock sequence
    if (currentModule.isLocked && currentModule.orderIndex > 0) {
      const previousModule = await prisma.module.findFirst({
        where: {
          courseId: currentModule.courseId,
          orderIndex: { lt: currentModule.orderIndex },
          tenantId,
        },
        orderBy: { orderIndex: 'desc' },
        include: {
          studentProgress: {
            where: { studentId },
          },
        },
      });

      if (previousModule) {
        const previousProgress = previousModule.studentProgress[0];
        if (!previousProgress?.completed) {
          throw new AppError(
            'You must complete the previous module to unlock this one',
            403
          );
        }
      }
    }

    const existingProgress = await prisma.studentProgress.findUnique({
      where: {
        studentId_moduleId: {
          studentId,
          moduleId,
        },
      },
    });
    const alreadyCompleted = existingProgress?.completed || false;

    const progress = await prisma.studentProgress.upsert({
      where: {
        studentId_moduleId: {
          studentId,
          moduleId,
        },
      },
      update: {
        progressPercentage:
          data.progressPercentage !== undefined
            ? data.progressPercentage
            : undefined,
        completed: data.completed !== undefined ? data.completed : undefined,
        lastAccessedAt: new Date(),
      },
      create: {
        tenantId,
        studentId,
        moduleId,
        progressPercentage: data.progressPercentage || 0,
        completed: data.completed || false,
        lastAccessedAt: new Date(),
      },
    });

    if (progress.completed && !alreadyCompleted) {
      // Use dynamic XP config instead of hardcoded 100
      const xpConfig = await gamificationService.getXpConfig(
        currentModule.courseId
      );
      await gamificationService.awardXp(
        studentId,
        tenantId,
        xpConfig.moduleCompletionXp,
        currentModule.courseId
      );

      // Count completed modules for badge checking
      const completedModules = await prisma.studentProgress.count({
        where: {
          studentId,
          tenantId,
          moduleId: {
            in: (
              await prisma.module.findMany({
                where: {
                  courseId: currentModule.courseId,
                  tenantId,
                },
                select: { id: true },
              })
            ).map((m) => m.id),
          },
          completed: true,
        },
      });

      await gamificationService.checkModuleCompletionBadges(
        studentId,
        tenantId,
        currentModule.courseId,
        completedModules
      );
    }

    // Course completion logic
    if (data.completed === true) {
      const allCourseModules = await prisma.module.findMany({
        where: { courseId: currentModule.courseId, tenantId },
        select: { id: true },
      });

      const completedProgressCount = await prisma.studentProgress.count({
        where: {
          studentId,
          tenantId,
          moduleId: { in: allCourseModules.map((m) => m.id) },
          completed: true,
        },
      });

      if (completedProgressCount === allCourseModules.length) {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { status: 'completed' },
        });

        // Award course completion XP and check badges
        const xpConfig = await gamificationService.getXpConfig(
          currentModule.courseId
        );
        await gamificationService.awardXp(
          studentId,
          tenantId,
          xpConfig.courseCompletionXp,
          currentModule.courseId
        );
        await gamificationService.checkCourseCompletionBadges(
          studentId,
          tenantId,
          currentModule.courseId
        );
      }
    }

    return progress;
  },

  async getDashboardStats(tenantId: string, studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { tenantId, studentId },
      select: { courseId: true, status: true },
    });

    const activeCourses = enrollments.filter(
      (e) => e.status === 'active'
    ).length;
    const completedCourses = enrollments.filter(
      (e) => e.status === 'completed'
    ).length;
    const totalEnrolled = enrollments.length;

    let totalProgressSum = 0;
    let modulesCount = 0;

    if (enrollments.length > 0) {
      const progressRecords = await prisma.studentProgress.findMany({
        where: { tenantId, studentId },
        select: { progressPercentage: true },
      });

      totalProgressSum = progressRecords.reduce(
        (sum, p) => sum + p.progressPercentage,
        0
      );

      const courseIds = enrollments.map((e) => e.courseId);
      modulesCount = await prisma.module.count({
        where: { tenantId, courseId: { in: courseIds } },
      });
    }

    const averageProgress =
      modulesCount > 0 ? Math.round(totalProgressSum / modulesCount) : 0;

    return {
      totalEnrolled,
      activeCourses,
      completedCourses,
      averageProgress,
    };
  },

  async updateLessonProgress(
    tenantId: string,
    studentId: string,
    lessonId: string,
    data: { completed?: boolean; timeSpent?: number }
  ) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId, tenantId },
      include: { module: true },
    });

    if (!lesson) {
      throw new AppError('Lesson not found', 404);
    }

    const isCompleted = data.completed ?? true;

    const progress = await prisma.lessonProgress.upsert({
      where: {
        studentId_lessonId: {
          studentId,
          lessonId,
        },
      },
      update: {
        completed: isCompleted,
        timeSpent: { increment: data.timeSpent || 0 },
        completedAt: isCompleted ? new Date() : undefined,
      },
      create: {
        tenantId,
        studentId,
        lessonId,
        completed: isCompleted,
        timeSpent: data.timeSpent || 0,
        completedAt: isCompleted ? new Date() : undefined,
      },
    });

    // Auto-update module progress percentage
    const totalLessons = await prisma.lesson.count({
      where: { moduleId: lesson.moduleId },
    });
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        studentId,
        lesson: { moduleId: lesson.moduleId },
        completed: true,
      },
    });

    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 100;
    const moduleCompleted = percentage >= 100;

    await this.updateModuleProgress(tenantId, studentId, lesson.moduleId, {
      progressPercentage: percentage,
      completed: moduleCompleted,
    });

    return progress;
  },

  async getCourseLessonProgress(
    tenantId: string,
    studentId: string,
    courseId: string
  ) {
    return prisma.lessonProgress.findMany({
      where: {
        tenantId,
        studentId,
        lesson: { module: { courseId } },
      },
      select: {
        lessonId: true,
        completed: true,
        timeSpent: true,
        completedAt: true,
      },
    });
  },

  async getStudentNotes(
    tenantId: string,
    studentId: string,
    courseId: string
  ) {
    return prisma.studentNote.findMany({
      where: { tenantId, studentId, courseId },
      orderBy: { updatedAt: 'desc' },
      include: {
        lesson: {
          select: { id: true, title: true },
        },
      },
    });
  },

  async saveStudentNote(
    tenantId: string,
    studentId: string,
    courseId: string,
    data: { lessonId?: string; content: string }
  ) {
    if (data.lessonId) {
      const existing = await prisma.studentNote.findFirst({
        where: { tenantId, studentId, courseId, lessonId: data.lessonId },
      });
      if (existing) {
        return prisma.studentNote.update({
          where: { id: existing.id },
          data: { content: data.content },
        });
      }
    }
    return prisma.studentNote.create({
      data: {
        tenantId,
        studentId,
        courseId,
        lessonId: data.lessonId || null,
        content: data.content,
      },
    });
  },
};
