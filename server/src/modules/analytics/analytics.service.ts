import prisma from '../../shared/database/prisma';

export interface AnalyticsStats {
  avgCompletionRate: number;
  dailyActiveLearners: number;
  avgExamScore: number;
  totalLearningHours: number;
  activeLearnersTimeline: { date: string; value: number }[];
  moduleCompletionDistribution: {
    label: string;
    percentage: number;
    hasInsight?: boolean;
  }[];
  coursePerformance: {
    id: string;
    title: string;
    icon: string;
    enrolled: number;
    completionRate: number;
    avgScore: number;
    status: 'Healthy' | 'Review' | 'At Risk';
  }[];
  insights: {
    id: string;
    type: 'error' | 'success' | 'warning';
    title: string;
    description: string;
    timestamp: string;
  }[];
}

export const analyticsService = {
  async getInstructorAnalytics(
    instructorId: string,
    tenantId: string
  ): Promise<AnalyticsStats> {
    try {
      // Find all courses created by this instructor
      const courses = await prisma.course.findMany({
        where: { tenantId, instructorId },
        select: { id: true, title: true },
      });

      if (courses.length === 0) {
        return this._getEmptyInstructorAnalytics();
      }

      const courseIds = courses.map((c) => c.id);

      // 1. Daily Active Learners (Count unique students active in the last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dailyActiveLearners = await prisma.user.count({
        where: {
          tenantId,
          role: 'student',
          lastActive: { gte: yesterday },
        },
      });

      // 2. Average Progress Completion Rate
      const modules = await prisma.module.findMany({
        where: { tenantId, courseId: { in: courseIds } },
        select: { id: true },
      });
      const moduleIds = modules.map((m) => m.id);

      const progressRecords = await prisma.studentProgress.findMany({
        where: { tenantId, moduleId: { in: moduleIds } },
        select: { progressPercentage: true, completed: true },
      });

      let avgCompletionRate = 0;
      if (progressRecords.length > 0) {
        const sum = progressRecords.reduce(
          (acc, p) => acc + p.progressPercentage,
          0
        );
        avgCompletionRate = Math.round(sum / progressRecords.length);
      }

      // 3. Average Exam Score
      const exams = await prisma.exam.findMany({
        where: { moduleId: { in: moduleIds } },
        select: { id: true },
      });
      const examIds = exams.map((ex) => ex.id);

      let avgExamScore = 0;
      if (examIds.length > 0) {
        const attempts = await prisma.examAttempt.findMany({
          where: { examId: { in: examIds } },
          select: { score: true },
        });
        if (attempts.length > 0) {
          const scoreSum = attempts.reduce(
            (acc, att) => acc + (att.score || 0),
            0
          );
          avgExamScore = Math.round(scoreSum / attempts.length);
        }
      }

      // 4. Total Learning Hours (Approximate based on progress records * 30 mins each for demo, or real session tracking)
      // Since we don't have explicit time tracking, we'll estimate 0.5 hours per progress record
      const totalLearningHours = Math.round(progressRecords.length * 0.5);

      // 5. Active Learners Timeline (Last 5 days)
      const activeLearnersTimeline: { date: string; value: number }[] = [];
      for (let i = 4; i >= 0; i--) {
        const dStart = new Date();
        dStart.setDate(dStart.getDate() - i);
        dStart.setHours(0, 0, 0, 0);

        const dEnd = new Date(dStart);
        dEnd.setHours(23, 59, 59, 999);

        const count = await prisma.user.count({
          where: {
            tenantId,
            role: 'student',
            lastActive: { gte: dStart, lte: dEnd },
          },
        });

        activeLearnersTimeline.push({
          date: dStart.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          value: count,
        });
      }

      // 6. Module Completion Distribution
      // Categorize module progress into brackets
      let intro = 0,
        mod1 = 0,
        mod2 = 0,
        mod3 = 0,
        final = 0;
      progressRecords.forEach((p) => {
        if (p.progressPercentage === 100) final++;
        else if (p.progressPercentage >= 75) mod3++;
        else if (p.progressPercentage >= 50) mod2++;
        else if (p.progressPercentage >= 25) mod1++;
        else intro++;
      });

      const totalRecords = progressRecords.length || 1;
      const moduleCompletionDistribution = [
        {
          label: '0-24%',
          percentage: Math.round((intro / totalRecords) * 100),
        },
        {
          label: '25-49%',
          percentage: Math.round((mod1 / totalRecords) * 100),
        },
        {
          label: '50-74%',
          percentage: Math.round((mod2 / totalRecords) * 100),
        },
        {
          label: '75-99%',
          percentage: Math.round((mod3 / totalRecords) * 100),
        },
        {
          label: 'Completed',
          percentage: Math.round((final / totalRecords) * 100),
        },
      ];

      // 7. Course Performance list
      const icons = ['javascript', 'database', 'api', 'school'];
      const coursePerformanceList = await Promise.all(
        courses.map(async (course, idx) => {
          const enrolled = await prisma.enrollment.count({
            where: { courseId: course.id },
          });
          const courseModules = await prisma.module.findMany({
            where: { courseId: course.id },
            select: { id: true },
          });
          const courseModuleIds = courseModules.map((m) => m.id);
          const courseProgress = await prisma.studentProgress.findMany({
            where: { moduleId: { in: courseModuleIds } },
            select: { progressPercentage: true },
          });

          let completionRate = 0;
          if (courseProgress.length > 0) {
            const progressSum = courseProgress.reduce(
              (sum, p) => sum + p.progressPercentage,
              0
            );
            completionRate = Math.round(progressSum / courseProgress.length);
          }

          // Real average score for the course
          let courseAvgScore = 0;
          const courseExams = await prisma.exam.findMany({
            where: { moduleId: { in: courseModuleIds } },
            select: { id: true },
          });
          const cExamIds = courseExams.map((e) => e.id);
          if (cExamIds.length > 0) {
            const courseAttempts = await prisma.examAttempt.findMany({
              where: { examId: { in: cExamIds } },
              select: { score: true },
            });
            if (courseAttempts.length > 0) {
              const sumS = courseAttempts.reduce(
                (acc, att) => acc + (att.score || 0),
                0
              );
              courseAvgScore = Math.round(sumS / courseAttempts.length);
            }
          }

          const status: 'Healthy' | 'Review' | 'At Risk' =
            completionRate > 70
              ? 'Healthy'
              : completionRate > 40
                ? 'Review'
                : 'At Risk';

          return {
            id: course.id,
            title: course.title,
            icon: icons[idx % icons.length],
            enrolled,
            completionRate,
            avgScore: courseAvgScore,
            status,
          };
        })
      );

      // 8. Dynamic Insights based on thresholds
      const insights: AnalyticsStats['insights'] = [];
      if (avgCompletionRate < 50 && courseIds.length > 0) {
        insights.push({
          id: 'i_warn_1',
          type: 'warning',
          title: 'Low Average Completion',
          description:
            'Overall student completion rate is dropping. Consider checking course module difficulties.',
          timestamp: 'Recent',
        });
      }
      if (avgExamScore > 85 && courseIds.length > 0) {
        insights.push({
          id: 'i_succ_1',
          type: 'success',
          title: 'High Exam Performance',
          description:
            'Students are scoring exceptionally well in exams across your courses.',
          timestamp: 'Recent',
        });
      }
      if (insights.length === 0) {
        insights.push({
          id: 'i_info_1',
          type: 'success',
          title: 'Steady Progress',
          description: 'Your metrics are stable. Keep up the good work!',
          timestamp: 'Just now',
        });
      }

      return {
        avgCompletionRate,
        dailyActiveLearners,
        avgExamScore,
        totalLearningHours,
        activeLearnersTimeline,
        moduleCompletionDistribution,
        coursePerformance: coursePerformanceList,
        insights,
      };
    } catch (dbError) {
      console.warn('Database error while querying analytics.');
      return this._getEmptyInstructorAnalytics();
    }
  },

  async getAdminAnalytics(tenantId: string) {
    try {
      // 1. Daily Active Learners
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dailyActive = await prisma.user.count({
        where: {
          tenantId,
          role: 'student',
          lastActive: { gte: yesterday },
        },
      });

      // 2. Total Instructors
      const totalInstructors = await prisma.user.count({
        where: { tenantId, role: 'instructor' },
      });

      // 3. Total Enrollments
      const totalEnrollments = await prisma.enrollment.count({
        where: { tenantId },
      });

      // 4. Total Revenue
      const totalRevenueResult = await prisma.payment.aggregate({
        where: { tenantId, paymentStatus: 'completed' },
        _sum: { amount: true },
      });
      const totalRevenue = Number(totalRevenueResult._sum.amount) || 0;

      // 5. Avg Course Completion
      const progressRecords = await prisma.studentProgress.findMany({
        where: { tenantId },
        select: { progressPercentage: true },
      });
      let avgCourseCompletion = 0;
      if (progressRecords.length > 0) {
        const sum = progressRecords.reduce(
          (acc, p) => acc + p.progressPercentage,
          0
        );
        avgCourseCompletion = Math.round(sum / progressRecords.length);
      }

      // 6. Enrollment & Revenue Trends (Past 9 Months)
      const enrollmentTrends: { month: string; value: number }[] = [];
      const revenueTrends: { month: string; value: number }[] = [];

      for (let i = 8; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );

        const count = await prisma.enrollment.count({
          where: {
            tenantId,
            enrolledAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        });

        const revResult = await prisma.payment.aggregate({
          where: {
            tenantId,
            paymentStatus: 'completed',
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: { amount: true },
        });

        const monthLabel = startOfMonth.toLocaleDateString('en-US', {
          month: 'short',
        });
        enrollmentTrends.push({ month: monthLabel, value: count });
        revenueTrends.push({
          month: monthLabel,
          value: Number(revResult._sum.amount) || 0,
        });
      }

      return {
        dailyActive,
        totalInstructors,
        totalEnrollments,
        totalRevenue,
        avgCourseCompletion,
        enrollmentTrends,
        revenueTrends,
      };
    } catch (dbError) {
      console.error('Error fetching admin analytics:', dbError);
      return {
        dailyActive: 0,
        totalInstructors: 0,
        totalEnrollments: 0,
        totalRevenue: 0,
        avgCourseCompletion: 0,
        enrollmentTrends: [],
        revenueTrends: [],
      };
    }
  },

  async getInstructorStudents(instructorId: string, tenantId: string) {
    const courses = await prisma.course.findMany({
      where: { tenantId, instructorId },
      select: { id: true, title: true },
    });

    if (courses.length === 0) {
      return [];
    }

    const courseIds = courses.map((c) => c.id);

    const enrollments = await prisma.enrollment.findMany({
      where: { tenantId, courseId: { in: courseIds } },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            lastActive: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    const studentsData = await Promise.all(
      enrollments.map(async (e) => {
        const student = e.student;
        const course = e.course;

        // Fetch modules for progress calculation
        const modules = await prisma.module.findMany({
          where: { courseId: course.id },
          select: { id: true },
        });
        const moduleIds = modules.map((m) => m.id);

        let progress = 0;
        let lastActiveTime = student.lastActive;

        if (moduleIds.length > 0) {
          const progresses = await prisma.studentProgress.findMany({
            where: { studentId: student.id, moduleId: { in: moduleIds } },
            select: { progressPercentage: true, lastAccessedAt: true },
          });

          if (progresses.length > 0) {
            const sum = progresses.reduce(
              (acc, p) => acc + p.progressPercentage,
              0
            );
            progress = Math.round(sum / moduleIds.length);

            // Find latest activity date
            const latestAccess = progresses.reduce(
              (latest, curr) =>
                curr.lastAccessedAt > latest ? curr.lastAccessedAt : latest,
              progresses[0].lastAccessedAt
            );
            if (latestAccess > lastActiveTime) {
              lastActiveTime = latestAccess;
            }
          }
        }

        // Fetch exam score
        const exams = await prisma.exam.findMany({
          where: { moduleId: { in: moduleIds } },
          select: { id: true },
        });
        const examIds = exams.map((ex) => ex.id);

        let avgScore = 0;
        if (examIds.length > 0) {
          const attempts = await prisma.examAttempt.findMany({
            where: { studentId: student.id, examId: { in: examIds } },
            select: { score: true },
          });
          if (attempts.length > 0) {
            const scoreSum = attempts.reduce(
              (acc, att) => acc + (att.score || 0),
              0
            );
            avgScore = Math.round(scoreSum / attempts.length);
          }
        }

        // Format relative last active time
        let relativeTime = 'Some time ago';
        const diffMs =
          new Date().getTime() - new Date(lastActiveTime).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) {
          relativeTime = 'Just now';
        } else if (diffMins < 60) {
          relativeTime = `${diffMins} minutes ago`;
        } else if (diffHours < 24) {
          relativeTime = `${diffHours} hours ago`;
        } else if (diffDays < 7) {
          relativeTime = `${diffDays} days ago`;
        } else {
          relativeTime = new Date(lastActiveTime).toLocaleDateString();
        }

        return {
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          avatar:
            student.avatar ||
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBBeVybkh4rfUSKu7QOf6QdzW5Thqqs11sxZ-FoJ5Jj4WhGOqvqQ2FO0trwf8GXn6OT9Har6FxVX9-oAEr5Vc4GLUIkd9fP9ph-7Bl5xG67dv5EnD2DKdLexZyVQdCbqKizUYSf0R6HFB53RP9EJktF6f9RKStZeZv0GCrJJ2_mBnrMuoxg_Rfl1a9OAD70BFojTNjRI9IjohPjPUOyHt6fwk2IJcbRH4KIa9HXFRuHoqsQIIpRta4Sb-1LLWTUwhelg68EHSQdcVk',
          course: course.title,
          progress,
          score: avgScore,
          lastActive: relativeTime,
        };
      })
    );

    return studentsData;
  },

  _getEmptyInstructorAnalytics(): AnalyticsStats {
    return {
      avgCompletionRate: 0,
      dailyActiveLearners: 0,
      avgExamScore: 0,
      totalLearningHours: 0,
      activeLearnersTimeline: [
        { date: 'Day 1', value: 0 },
        { date: 'Day 2', value: 0 },
        { date: 'Day 3', value: 0 },
        { date: 'Day 4', value: 0 },
        { date: 'Day 5', value: 0 },
      ],
      moduleCompletionDistribution: [
        { label: '0-24%', percentage: 0 },
        { label: '25-49%', percentage: 0 },
        { label: '50-74%', percentage: 0 },
        { label: '75-99%', percentage: 0 },
        { label: 'Completed', percentage: 0 },
      ],
      coursePerformance: [],
      insights: [],
    };
  },

  async getStudentAnalytics(studentId: string, tenantId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId, tenantId },
      include: {
        course: {
          include: {
            category: true,
            modules: {
              include: {
                lessons: {
                  select: { id: true, duration: true },
                },
              },
            },
          },
        },
      },
    });

    const lessonProgresses = await prisma.lessonProgress.findMany({
      where: { studentId, tenantId },
      include: {
        lesson: {
          select: { id: true, title: true, duration: true },
        },
      },
    });

    const examAttempts = await prisma.examAttempt.findMany({
      where: { studentId, tenantId },
      orderBy: { startedAt: 'desc' },
      include: {
        exam: {
          select: { title: true, passingScore: true },
        },
      },
    });

    const user = await prisma.user.findFirst({
      where: { id: studentId, tenantId },
      select: { xp: true, level: true, streak: true },
    });

    const totalEnrolled = enrollments.length;
    const completedCourses = enrollments.filter(
      (e) => e.status === 'completed'
    ).length;
    const inProgressCourses = totalEnrolled - completedCourses;

    const completedLessons = lessonProgresses.filter((lp) => lp.completed);
    const totalLessonsCompleted = completedLessons.length;

    const totalStudyMinutes = lessonProgresses.reduce((acc, lp) => {
      const minutes =
        lp.timeSpent > 0 ? Math.round(lp.timeSpent / 60) : lp.completed ? 15 : 5;
      return acc + minutes;
    }, 0);

    const gradedAttempts = examAttempts.filter((a) => a.score !== null);
    const avgExamScore =
      gradedAttempts.length > 0
        ? Math.round(
            gradedAttempts.reduce((acc, a) => acc + (a.score || 0), 0) /
              gradedAttempts.length
          )
        : 0;
    const examsPassedCount = examAttempts.filter((a) => a.passed).length;

    const now = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const past7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const dayStr = d.toISOString().split('T')[0];
      const dayLabel = dayNames[d.getDay()];

      const dayProgresses = lessonProgresses.filter((lp) => {
        const pDate = new Date(lp.updatedAt).toISOString().split('T')[0];
        return pDate === dayStr;
      });

      const minutes = dayProgresses.reduce((sum, p) => {
        return (
          sum +
          (p.timeSpent > 0 ? Math.round(p.timeSpent / 60) : p.completed ? 20 : 10)
        );
      }, 0);

      return {
        date: dayStr,
        day: dayLabel,
        minutes: minutes,
        lessons: dayProgresses.filter((p) => p.completed).length,
      };
    });

    const categoryMap = new Map<
      string,
      {
        name: string;
        courses: number;
        completedLessons: number;
        totalLessons: number;
      }
    >();

    for (const enr of enrollments) {
      const catName = enr.course.category?.name || 'General Skills';
      if (!categoryMap.has(catName)) {
        categoryMap.set(catName, {
          name: catName,
          courses: 0,
          completedLessons: 0,
          totalLessons: 0,
        });
      }
      const item = categoryMap.get(catName)!;
      item.courses += 1;

      let courseTotalLessons = 0;
      let courseCompletedLessons = 0;
      for (const mod of enr.course.modules) {
        courseTotalLessons += mod.lessons.length;
        for (const les of mod.lessons) {
          const isDone = lessonProgresses.some(
            (lp) => lp.lessonId === les.id && lp.completed
          );
          if (isDone) courseCompletedLessons += 1;
        }
      }
      item.totalLessons += courseTotalLessons;
      item.completedLessons += courseCompletedLessons;
    }

    const categoryMastery = Array.from(categoryMap.values()).map((cat) => ({
      category: cat.name,
      courseCount: cat.courses,
      completedLessons: cat.completedLessons,
      totalLessons: cat.totalLessons,
      percentage:
        cat.totalLessons > 0
          ? Math.round((cat.completedLessons / cat.totalLessons) * 100)
          : 0,
    }));

    const recentExams = examAttempts.slice(0, 5).map((att) => ({
      id: att.id,
      examTitle: att.exam.title,
      score: att.score || 0,
      passingScore: att.exam.passingScore,
      passed: att.passed,
      date: att.submittedAt || att.startedAt,
    }));

    return {
      kpis: {
        totalEnrolled,
        completedCourses,
        inProgressCourses,
        totalLessonsCompleted,
        totalStudyHours: Number((totalStudyMinutes / 60).toFixed(1)),
        totalStudyMinutes,
        avgExamScore,
        examsPassedCount,
        streak: user?.streak || 0,
        xp: user?.xp || 0,
        level: user?.level || 1,
      },
      weeklyActivity: past7Days,
      categoryMastery,
      recentExams,
    };
  },
};
