import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export const coursesService = {
  async getAllCourses(
    tenantId?: string,
    role: string = 'student',
    instructorId?: string,
    filters?: {
      search?: string;
      category?: string;
      categoryId?: string;
      difficulty?: string;
      pricing?: string;
      sortBy?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const whereClause: any = {};
    if (tenantId) {
      whereClause.tenantId = tenantId;
    }
    if (role === 'student') {
      whereClause.isPublished = true;
    }
    if (role === 'instructor' && instructorId) {
      whereClause.instructorId = instructorId;
    }

    if (filters?.pricing === 'free') {
      whereClause.price = 0;
    } else if (filters?.pricing === 'paid') {
      whereClause.price = { gt: 0 };
    }

    const searchConditions: any[] = [];
    if (filters?.search && filters.search.trim()) {
      const searchTerms = filters.search.trim();
      searchConditions.push(
        { title: { contains: searchTerms, mode: 'insensitive' } },
        { description: { contains: searchTerms, mode: 'insensitive' } },
        {
          instructor: {
            OR: [
              { firstName: { contains: searchTerms, mode: 'insensitive' } },
              { lastName: { contains: searchTerms, mode: 'insensitive' } },
            ],
          },
        }
      );
    }

    if (filters?.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }

    if (filters?.category && filters.category !== 'All' && filters.category !== 'all') {
      searchConditions.push(
        { category: { slug: filters.category } },
        { category: { name: { contains: filters.category, mode: 'insensitive' } } },
        { title: { contains: filters.category, mode: 'insensitive' } },
        { description: { contains: filters.category, mode: 'insensitive' } }
      );
    }

    if (filters?.difficulty && filters.difficulty !== 'All' && filters.difficulty !== 'all') {
      searchConditions.push(
        { description: { contains: filters.difficulty, mode: 'insensitive' } }
      );
    }

    if (searchConditions.length > 0) {
      whereClause.OR = searchConditions;
    }

    // Determine sorting
    let orderBy: any = { createdAt: 'desc' };
    if (filters?.sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    } else if (filters?.sortBy === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (filters?.sortBy === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (filters?.sortBy === 'popular') {
      orderBy = { enrollments: { _count: 'desc' } };
    }

    const page = Math.max(1, Number(filters?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters?.limit) || 9));
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where: whereClause,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              icon: true,
            },
          },
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
          tenant: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
            },
          },
          modules: {
            select: {
              id: true,
              title: true,
              orderIndex: true,
              lessons: {
                select: { id: true, title: true, duration: true },
              },
            },
          },
          _count: {
            select: { enrollments: true, modules: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.course.count({ where: whereClause }),
    ]);

    return {
      courses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  },

  async getEnrolledCourses(tenantId: string, studentId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: { tenantId, studentId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            modules: {
              select: { id: true },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    // Fetch progress for these courses
    const courseIds = enrollments.map((e) => e.courseId);

    // We only need the student's progress records for the modules of these courses
    const progressRecords = await prisma.studentProgress.findMany({
      where: {
        tenantId,
        studentId,
        module: {
          courseId: { in: courseIds },
        },
      },
      include: {
        module: { select: { courseId: true } },
      },
    });

    return enrollments.map((e) => {
      // Calculate progress for this specific course
      const courseProgressRecords = progressRecords.filter(
        (pr) => pr.module.courseId === e.courseId
      );
      const totalModules = e.course.modules.length;

      let courseProgress = 0;
      let lastAccessedAt = e.enrolledAt; // Fallback

      if (totalModules > 0 && courseProgressRecords.length > 0) {
        const sum = courseProgressRecords.reduce(
          (acc, curr) => acc + curr.progressPercentage,
          0
        );
        courseProgress = Math.round(sum / totalModules);

        // Find most recent access
        const latestAccess = courseProgressRecords.reduce(
          (latest, curr) =>
            curr.lastAccessedAt > latest ? curr.lastAccessedAt : latest,
          new Date(0)
        );

        if (latestAccess.getTime() > 0) {
          lastAccessedAt = latestAccess;
        }
      }

      // We remove the modules from the response to keep payload small
      const { modules, ...courseData } = e.course;

      return {
        ...courseData,
        progress: courseProgress,
        lastAccessedAt,
      };
    });
  },

  async getCourseById(
    id: string,
    tenantId?: string,
    role: string = 'student',
    userId?: string
  ) {
    const where: any = { id };
    if (tenantId) {
      where.tenantId = tenantId;
    }

    const course = await prisma.course.findFirst({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
          },
        },
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
            },
            exams: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      throw AppError.notFound('Course not found');
    }

    if (role === 'student' && userId) {
      if (!course.isPublished) {
        // Check if student is enrolled
        const enrollment = await prisma.enrollment.findUnique({
          where: {
            studentId_courseId: {
              studentId: userId,
              courseId: id,
            },
          },
        });
        if (!enrollment) {
          throw AppError.forbidden(
            'Access denied. This course is not published.'
          );
        }
      }

      // Fetch student progress for these modules
      const progress = await prisma.studentProgress.findMany({
        where: {
          studentId: userId,
          moduleId: { in: course.modules.map((m) => m.id) },
        },
      });

      const progressMap = new Map(progress.map((p) => [p.moduleId, p]));

      // Apply conditional locking logic (FR-PROG-2)
      let previousModuleCompleted = true; // First module is always unlocked
      course.modules = course.modules.map((module, index) => {
        // First module is unlocked. Subsequent modules unlock if the previous one is completed.
        const isLocked = !previousModuleCompleted;

        // Check if THIS module is completed to unlock the NEXT one
        const modProgress = progressMap.get(module.id);
        previousModuleCompleted = modProgress?.completed === true;

        return {
          ...module,
          isLocked,
        };
      });
    }

    return course;
  },

  async createCourse(data: any, tenantId: string, instructorId: string) {
    return prisma.course.create({
      data: {
        ...data,
        tenantId,
        instructorId,
      },
    });
  },

  async updateCourse(
    id: string,
    data: any,
    tenantId: string,
    userId: string,
    role: string
  ) {
    const course = await prisma.course.findFirst({
      where: { id, tenantId },
    });

    if (!course) {
      throw AppError.notFound('Course not found');
    }

    if (role === 'instructor' && course.instructorId !== userId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }

    return prisma.course.update({
      where: { id },
      data,
    });
  },

  async publishCourse(
    id: string,
    isPublished: boolean,
    tenantId: string,
    userId: string,
    role: string
  ) {
    // Check if user has permission to publish/unpublish courses
    const course = await prisma.course.findFirst({
      where: { id, tenantId },
    });

    if (!course) {
      throw AppError.notFound('Course not found');
    }

    let userRole;
    if (role === 'instructor' && course.instructorId !== userId) {
      // For instructors, they must be the owner of the course to modify it
      throw AppError.forbidden('Access denied. You do not own this course.');
    } else if (role === 'admin' || role === 'super_admin') {
      // Admins and super_admins can publish any course in their tenant
      userRole = role;
    } else {
      // Regular instructors have more limited permissions
      if (course.instructorId !== userId) {
        throw AppError.forbidden('Access denied');
      }
      userRole = 'instructor';
    }

    // Update the course publication status
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        isPublished,
      },
    });

    // Log the publishing action in a moderation log
    // await prisma.coursePublicationLog.create({
    //   data: {
    //     courseId: id,
    //     tenantId,
    //     userId,
    //     action: isPublished ? 'published' : 'unpublished',
    //     role: userRole,
    //     previousStatus: course.isPublished,
    //     newStatus: isPublished,
    //   },
    // });

    return updatedCourse;
  },

  async deleteCourse(
    id: string,
    tenantId: string,
    userId: string,
    role: string
  ) {
    const course = await prisma.course.findFirst({
      where: { id, tenantId },
    });

    if (!course) {
      throw AppError.notFound('Course not found');
    }

    if (role === 'instructor' && course.instructorId !== userId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }

    await prisma.course.delete({
      where: { id },
    });
  },

  async enrollStudent(courseId: string, tenantId: string, studentId: string) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, tenantId },
    });

    if (!course) {
      throw AppError.notFound('Course not found');
    }

    if (!course.isPublished) {
      throw AppError.badRequest('Cannot enroll in an unpublished course.');
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return existingEnrollment;
    }

    return prisma.enrollment.create({
      data: {
        tenantId,
        studentId,
        courseId,
      },
    });
  },

  async enrollStudentByEmail(
    courseId: string,
    tenantId: string,
    email: string,
    instructorId: string,
    role: string
  ) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, tenantId },
    });

    if (!course) {
      throw AppError.notFound('Course not found');
    }

    if (role === 'instructor' && course.instructorId !== instructorId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }

    const student = await prisma.user.findFirst({
      where: { email, tenantId, role: 'student' },
    });

    if (!student) {
      throw AppError.notFound(
        'Student not found. Make sure the email belongs to a registered student.'
      );
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: student.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw AppError.badRequest('This student is already enrolled in this course.');
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        tenantId,
        studentId: student.id,
        courseId,
      },
    });

    return {
      ...enrollment,
      student: {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        avatar: student.avatar,
      },
    };
  },

  async bulkEnrollStudents(
    courseId: string,
    tenantId: string,
    options: { emails?: string[]; studentIds?: string[] },
    instructorId: string,
    role: string
  ) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, tenantId },
    });

    if (!course) {
      throw AppError.notFound('Course not found');
    }

    if (role === 'instructor' && course.instructorId !== instructorId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }

    const { emails = [], studentIds = [] } = options;
    const addedStudents: any[] = [];
    const errors: string[] = [];
    const processedStudentIds = new Set<string>();

    // Process student IDs
    if (studentIds.length > 0) {
      const students = await prisma.user.findMany({
        where: { id: { in: studentIds }, tenantId, role: 'student' },
      });
      for (const student of students) {
        processedStudentIds.add(student.id);
        try {
          const existing = await prisma.enrollment.findUnique({
            where: { studentId_courseId: { studentId: student.id, courseId } },
          });
          if (!existing) {
            const enrollment = await prisma.enrollment.create({
              data: { tenantId, studentId: student.id, courseId },
            });
            addedStudents.push({ ...enrollment, student });
          } else {
            errors.push(`Student ID ${student.id} already enrolled.`);
          }
        } catch (e) {
          errors.push(`Error enrolling Student ID ${student.id}`);
        }
      }
    }

    // Process emails
    if (emails.length > 0) {
      const students = await prisma.user.findMany({
        where: { email: { in: emails }, tenantId, role: 'student' },
      });
      
      const foundEmails = students.map((s) => s.email);
      const notFoundEmails = emails.filter((e) => !foundEmails.includes(e));
      for (const email of notFoundEmails) {
        errors.push(`Email not found: ${email}`);
      }

      for (const student of students) {
        if (processedStudentIds.has(student.id)) continue;
        processedStudentIds.add(student.id);
        try {
          const existing = await prisma.enrollment.findUnique({
            where: { studentId_courseId: { studentId: student.id, courseId } },
          });
          if (!existing) {
            const enrollment = await prisma.enrollment.create({
              data: { tenantId, studentId: student.id, courseId },
            });
            addedStudents.push({ ...enrollment, student });
          } else {
            errors.push(`Student ${student.email} already enrolled.`);
          }
        } catch (e) {
          errors.push(`Error enrolling Student ${student.email}`);
        }
      }
    }

    return {
      success: true,
      added: addedStudents,
      errors
    };
  },

  async getEnrolledStudents(
    courseId: string,
    tenantId: string,
    instructorId: string,
    role: string
  ) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, tenantId },
    });

    if (!course) {
      throw AppError.notFound('Course not found');
    }

    if (role === 'instructor' && course.instructorId !== instructorId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return enrollments;
  },

  async unenrollStudent(
    courseId: string,
    studentId: string,
    tenantId: string,
    instructorId: string,
    role: string
  ) {
    const course = await prisma.course.findFirst({
      where: { id: courseId, tenantId },
    });

    if (!course) {
      throw AppError.notFound('Course not found');
    }

    if (role === 'instructor' && course.instructorId !== instructorId) {
      throw AppError.forbidden('Access denied. You do not own this course.');
    }

    await prisma.enrollment.delete({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
    });
  },

  async getTenantStudents(tenantId: string) {
    return prisma.user.findMany({
      where: {
        tenantId,
        role: 'student',
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
      },
      orderBy: { firstName: 'asc' },
    });
  },
};
