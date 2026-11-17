import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';
import { CreateLearningPathDto, UpdateLearningPathDto, LearningPathProgress } from './learning-paths.types';

export const learningPathsService = {
  async getAll(tenantId?: string, isPublished?: boolean) {
    const where: any = {};
    if (tenantId) where.tenantId = tenantId;
    if (isPublished !== undefined) where.isPublished = isPublished;

    return prisma.learningPath.findMany({
      where,
      include: {
        instructor: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                price: true,
                description: true,
                isPublished: true,
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getEnrolled(studentId: string, tenantId?: string) {
    const where: any = { studentId };
    if (tenantId) where.tenantId = tenantId;

    const enrollments = await prisma.learningPathEnrollment.findMany({
      where,
      include: {
        learningPath: {
          include: {
            instructor: {
              select: { id: true, firstName: true, lastName: true, avatar: true },
            },
            courses: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                    thumbnail: true,
                    price: true,
                    description: true,
                  },
                },
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    // Calculate progress for each learning path
    const results = await Promise.all(
      enrollments.map(async (enr) => {
        const path = enr.learningPath;
        const totalCourses = path.courses.length;
        if (totalCourses === 0) {
          return {
            ...enr,
            progressPercentage: 100,
            completedCourses: 0,
            totalCourses: 0,
          };
        }

        const courseIds = path.courses.map((c) => c.courseId);
        const studentEnrollments = await prisma.enrollment.findMany({
          where: {
            studentId,
            courseId: { in: courseIds },
          },
          select: { courseId: true, status: true },
        });

        const completedCourses = studentEnrollments.filter(
          (e) => e.status === 'completed'
        ).length;
        const progressPercentage = Math.round((completedCourses / totalCourses) * 100);

        return {
          ...enr,
          progressPercentage,
          completedCourses,
          totalCourses,
        };
      })
    );

    return results;
  },

  async getByInstructor(instructorId: string, tenantId?: string) {
    const where: any = { instructorId };
    if (tenantId) where.tenantId = tenantId;

    return prisma.learningPath.findMany({
      where,
      include: {
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
                price: true,
                isPublished: true,
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getById(id: string, tenantId?: string, studentId?: string) {
    const where: any = { id };
    if (tenantId) where.tenantId = tenantId;

    const path = await prisma.learningPath.findFirst({
      where,
      include: {
        instructor: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
        courses: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                thumbnail: true,
                price: true,
                isPublished: true,
                modules: {
                  select: { id: true, title: true, orderIndex: true },
                  orderBy: { orderIndex: 'asc' },
                },
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!path) {
      throw AppError.notFound('Learning path not found');
    }

    let isEnrolled = false;
    let pathProgress: LearningPathProgress | null = null;

    if (studentId) {
      const enrollment = await prisma.learningPathEnrollment.findUnique({
        where: {
          studentId_learningPathId: {
            studentId,
            learningPathId: id,
          },
        },
      });

      isEnrolled = !!enrollment;

      if (isEnrolled) {
        const courseIds = path.courses.map((c) => c.courseId);
        const studentCourseEnrollments = await prisma.enrollment.findMany({
          where: {
            studentId,
            courseId: { in: courseIds },
          },
        });

        const enrolledCourseMap = new Map(
          studentCourseEnrollments.map((e) => [e.courseId, e])
        );

        const courseDetails = path.courses.map((pc) => {
          const ce = enrolledCourseMap.get(pc.courseId);
          const isCompleted = ce?.status === 'completed';
          return {
            courseId: pc.courseId,
            title: pc.course.title,
            orderIndex: pc.orderIndex,
            isEnrolled: !!ce,
            isCompleted,
            progressPercentage: isCompleted ? 100 : ce ? 50 : 0,
          };
        });

        const completedCount = courseDetails.filter((c) => c.isCompleted).length;
        const total = courseDetails.length;
        const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        pathProgress = {
          learningPathId: id,
          title: path.title,
          totalCourses: total,
          completedCourses: completedCount,
          progressPercentage: pct,
          isCompleted: total > 0 && completedCount === total,
          courses: courseDetails,
        };
      }
    }

    return {
      ...path,
      isEnrolled,
      progress: pathProgress,
    };
  },

  async create(instructorId: string, tenantId: string, data: CreateLearningPathDto) {
    if (!data.title?.trim()) {
      throw AppError.badRequest('Learning path title is required');
    }

    const path = await prisma.learningPath.create({
      data: {
        title: data.title.trim(),
        description: data.description,
        thumbnail: data.thumbnail,
        price: data.price ?? 0,
        isPublished: data.isPublished ?? false,
        instructorId,
        tenantId,
      },
    });

    if (data.courseIds && data.courseIds.length > 0) {
      await prisma.learningPathCourse.createMany({
        data: data.courseIds.map((courseId, index) => ({
          learningPathId: path.id,
          courseId,
          orderIndex: index,
        })),
        skipDuplicates: true,
      });
    }

    return this.getById(path.id, tenantId);
  },

  async update(
    id: string,
    instructorId: string,
    role: string,
    tenantId: string,
    data: UpdateLearningPathDto
  ) {
    const existing = await prisma.learningPath.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw AppError.notFound('Learning path not found');
    }

    if (role === 'instructor' && existing.instructorId !== instructorId) {
      throw AppError.forbidden('You do not have permission to update this learning path');
    }

    await prisma.learningPath.update({
      where: { id },
      data: {
        title: data.title !== undefined ? data.title.trim() : existing.title,
        description: data.description !== undefined ? data.description : existing.description,
        thumbnail: data.thumbnail !== undefined ? data.thumbnail : existing.thumbnail,
        price: data.price !== undefined ? data.price : existing.price,
        isPublished: data.isPublished !== undefined ? data.isPublished : existing.isPublished,
      },
    });

    if (data.courseIds !== undefined) {
      // Re-sync courses
      await prisma.learningPathCourse.deleteMany({
        where: { learningPathId: id },
      });

      if (data.courseIds.length > 0) {
        await prisma.learningPathCourse.createMany({
          data: data.courseIds.map((courseId, index) => ({
            learningPathId: id,
            courseId,
            orderIndex: index,
          })),
          skipDuplicates: true,
        });
      }
    }

    return this.getById(id, tenantId);
  },

  async delete(id: string, instructorId: string, role: string, tenantId: string) {
    const existing = await prisma.learningPath.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw AppError.notFound('Learning path not found');
    }

    if (role === 'instructor' && existing.instructorId !== instructorId) {
      throw AppError.forbidden('You do not have permission to delete this learning path');
    }

    await prisma.learningPath.delete({
      where: { id },
    });

    return { message: 'Learning path deleted successfully' };
  },

  async enroll(learningPathId: string, studentId: string, tenantId: string) {
    const path = await prisma.learningPath.findFirst({
      where: { id: learningPathId, tenantId },
      include: {
        courses: true,
      },
    });

    if (!path) {
      throw AppError.notFound('Learning path not found');
    }

    // Check if already enrolled in path
    const existing = await prisma.learningPathEnrollment.findUnique({
      where: {
        studentId_learningPathId: {
          studentId,
          learningPathId,
        },
      },
    });

    if (existing) {
      return { message: 'Already enrolled in this learning path', enrollment: existing };
    }

    // 1. Create LearningPathEnrollment
    const pathEnrollment = await prisma.learningPathEnrollment.create({
      data: {
        tenantId,
        studentId,
        learningPathId,
        status: 'active',
      },
    });

    // 2. Automatically enroll student in each course of the bundle
    for (const pc of path.courses) {
      const courseEnrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId,
            courseId: pc.courseId,
          },
        },
      });

      if (!courseEnrollment) {
        await prisma.enrollment.create({
          data: {
            tenantId,
            studentId,
            courseId: pc.courseId,
            status: 'active',
          },
        });
      }
    }

    return {
      message: 'Successfully enrolled in learning path and bundled courses',
      enrollment: pathEnrollment,
    };
  },
};
