import prisma from '../../shared/database/prisma';

export const searchService = {
  async searchAll(tenantId: string, query: string) {
    if (!query || query.trim().length < 2) {
      return { courses: [], lessons: [], instructors: [] };
    }

    const searchTerm = query.trim();

    // Search courses
    const courses = await prisma.course.findMany({
      where: {
        tenantId,
        isPublished: true,
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        price: true,
        instructor: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 6,
    });

    // Search lessons
    const lessons = await prisma.lesson.findMany({
      where: {
        tenantId,
        module: {
          course: {
            isPublished: true,
          },
        },
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { content: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        title: true,
        type: true,
        duration: true,
        module: {
          select: {
            id: true,
            title: true,
            courseId: true,
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      take: 8,
    });

    // Search instructors
    const instructors = await prisma.user.findMany({
      where: {
        tenantId,
        role: 'instructor',
        status: 'active',
        OR: [
          { firstName: { contains: searchTerm, mode: 'insensitive' } },
          { lastName: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        _count: {
          select: {
            instructorCourses: {
              where: { isPublished: true },
            },
          },
        },
      },
      take: 4,
    });

    return {
      courses,
      lessons,
      instructors,
    };
  },
};
