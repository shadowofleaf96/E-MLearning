import { Request, Response, NextFunction } from 'express';
import { coursesService } from './courses.service';
import { AppError } from '../../shared/errors/AppError';

export async function getAllCourses(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    let tenantId =
      req.tenant?.id ||
      req.user?.tenantId ||
      (req.query.tenantId as string | undefined);
    if (req.user?.role === 'super_admin' && req.query.tenantId) {
      tenantId = req.query.tenantId as string;
    }

    const role = req.user?.role || 'student';
    const instructorId = role === 'instructor' ? req.user?.id : undefined;

    const {
      search,
      category,
      categoryId,
      difficulty,
      pricing,
      sortBy,
      page,
      limit,
    } = req.query;

    const result = await coursesService.getAllCourses(
      tenantId,
      role,
      instructorId,
      {
        search: search ? String(search) : undefined,
        category: category ? String(category) : undefined,
        categoryId: categoryId ? String(categoryId) : undefined,
        difficulty: difficulty ? String(difficulty) : undefined,
        pricing: pricing ? String(pricing) : undefined,
        sortBy: sortBy ? String(sortBy) : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      }
    );

    res.json({
      status: 'success',
      data: result.courses,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

export async function getEnrolledCourses(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    const studentId = req.user?.id;
    if (!tenantId || !studentId) {
      throw AppError.unauthorized('User or tenant not identified');
    }
    const courses = await coursesService.getEnrolledCourses(
      tenantId,
      studentId
    );
    res.status(200).json({ status: 'success', data: courses });
  } catch (error) {
    next(error);
  }
}

export async function getCourseById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId =
      req.tenant?.id ||
      req.user?.tenantId ||
      (req.query.tenantId as string | undefined);
    const id = req.params.id as string;
    const role = req.user?.role || 'student';
    const userId = req.user?.id;
    const course = await coursesService.getCourseById(
      id,
      tenantId,
      role,
      userId
    );
    res.json({ status: 'success', data: course });
  } catch (error) {
    next(error);
  }
}

export async function createCourse(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    if (!userId) {
      throw AppError.unauthorized('User not authenticated');
    }
    const course = await coursesService.createCourse(
      req.body,
      tenantId,
      userId
    );
    res.status(201).json({ status: 'success', data: course });
  } catch (error) {
    next(error);
  }
}

export async function updateCourse(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw AppError.unauthorized('User not authenticated');
    }
    const id = req.params.id as string;
    const course = await coursesService.updateCourse(
      id,
      req.body,
      tenantId,
      userId,
      role
    );
    res.json({ status: 'success', data: course });
  } catch (error) {
    next(error);
  }
}

export async function publishCourse(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw AppError.unauthorized('User not authenticated');
    }
    const id = req.params.id as string;
    const { isPublished } = req.body;

    if (isPublished === undefined) {
      throw AppError.badRequest('isPublished field is required');
    }

    const course = await coursesService.publishCourse(
      id,
      isPublished,
      tenantId,
      userId,
      role
    );
    res.json({ status: 'success', data: course });
  } catch (error) {
    next(error);
  }
}

export async function submitForReview(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    if (!userId) {
      throw AppError.unauthorized('User not authenticated');
    }
    const id = req.params.id as string;
    const course = await coursesService.submitForReview(id, tenantId, userId);
    res.json({
      status: 'success',
      message: 'Course submitted for admin review',
      data: course,
    });
  } catch (error) {
    next(error);
  }
}

export async function moderateCourse(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const reviewerId = req.user?.id;
    if (!reviewerId) {
      throw AppError.unauthorized('User not authenticated');
    }
    const id = req.params.id as string;
    const { action, comment } = req.body;
    const course = await coursesService.moderateCourse(
      id,
      tenantId,
      reviewerId,
      action,
      comment
    );
    res.json({
      status: 'success',
      message: `Course ${action} action recorded`,
      data: course,
    });
  } catch (error) {
    next(error);
  }
}

export async function getModerationLogs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const id = req.params.id as string;
    const logs = await coursesService.getModerationLogs(id, tenantId);
    res.json({ status: 'success', data: logs });
  } catch (error) {
    next(error);
  }
}

export async function getAdminModerationQueue(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const courses = await coursesService.getAdminModerationQueue(tenantId);
    res.json({ status: 'success', data: courses });
  } catch (error) {
    next(error);
  }
}

export async function deleteCourse(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw AppError.unauthorized('User not authenticated');
    }
    const id = req.params.id as string;
    await coursesService.deleteCourse(id, tenantId, userId, role);
    res.json({ status: 'success', message: 'Course deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function enrollStudent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    if (!userId) {
      throw AppError.unauthorized('User not authenticated');
    }
    const id = req.params.id as string;
    const enrollment = await coursesService.enrollStudent(id, tenantId, userId);
    res.json({ status: 'success', data: enrollment });
  } catch (error) {
    next(error);
  }
}

export async function enrollStudentByEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw AppError.unauthorized('User not authenticated');
    }
    const courseId = req.params.id as string;
    const { email } = req.body;
    if (!email) {
      throw AppError.badRequest('Student email is required');
    }
    const enrollment = await coursesService.enrollStudentByEmail(
      courseId,
      tenantId,
      email,
      userId,
      role
    );
    res.status(201).json({ status: 'success', data: enrollment });
  } catch (error) {
    next(error);
  }
}

export async function bulkEnrollStudents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw AppError.unauthorized('User not authenticated');
    }
    const courseId = req.params.id as string;
    const { emails, studentIds } = req.body;

    if (
      (!emails || emails.length === 0) &&
      (!studentIds || studentIds.length === 0)
    ) {
      throw AppError.badRequest('At least one email or studentId is required');
    }

    const result = await coursesService.bulkEnrollStudents(
      courseId,
      tenantId,
      { emails, studentIds },
      userId,
      role
    );
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

export async function getEnrolledStudents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw AppError.unauthorized('User not authenticated');
    }
    const courseId = req.params.id as string;
    const enrollments = await coursesService.getEnrolledStudents(
      courseId,
      tenantId,
      userId,
      role
    );
    res.json({ status: 'success', data: enrollments });
  } catch (error) {
    next(error);
  }
}

export async function unenrollStudent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw AppError.unauthorized('User not authenticated');
    }
    const courseId = req.params.id as string;
    const studentId = req.params.studentId as string;
    await coursesService.unenrollStudent(
      courseId,
      studentId,
      tenantId,
      userId,
      role
    );
    res.json({ status: 'success', message: 'Student unenrolled successfully' });
  } catch (error) {
    next(error);
  }
}

export async function getTenantStudents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const students = await coursesService.getTenantStudents(tenantId);
    res.json({ status: 'success', data: students });
  } catch (error) {
    next(error);
  }
}

export async function getCoursePrerequisites(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId =
      req.tenant?.id ||
      req.user?.tenantId ||
      (req.query.tenantId as string | undefined);
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const courseId = req.params.id as string;
    const prerequisites = await coursesService.getPrerequisites(courseId, tenantId);
    res.json({ status: 'success', data: prerequisites });
  } catch (error) {
    next(error);
  }
}

export async function setCoursePrerequisites(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const userId = req.user?.id;
    const role = req.user?.role;
    if (!userId || !role) {
      throw AppError.unauthorized('User not authenticated');
    }
    const courseId = req.params.id as string;
    const { prerequisiteIds } = req.body;
    const prerequisites = await coursesService.setPrerequisites(
      courseId,
      prerequisiteIds,
      userId,
      role,
      tenantId
    );
    res.json({
      status: 'success',
      message: 'Prerequisites updated successfully',
      data: prerequisites,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPrerequisiteStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tenantId = req.tenant?.id || req.user?.tenantId;
    if (!tenantId) {
      throw AppError.badRequest('Tenant ID is required');
    }
    const studentId = req.user?.id;
    if (!studentId) {
      throw AppError.unauthorized('User not authenticated');
    }
    const courseId = req.params.id as string;
    const status = await coursesService.checkPrerequisites(
      courseId,
      studentId,
      tenantId
    );
    res.json({ status: 'success', data: status });
  } catch (error) {
    next(error);
  }
}
