import prisma from '../../shared/database/prisma';
import { AppError } from '../../shared/errors/AppError';

export const assignmentsService = {
  async getModuleAssignments(
    tenantId: string,
    moduleId: string,
    studentId?: string
  ) {
    const assignments = await prisma.assignment.findMany({
      where: { tenantId, moduleId },
      include: {
        submissions: studentId
          ? {
              where: { studentId },
              select: {
                id: true,
                grade: true,
                feedback: true,
                submittedAt: true,
                gradedAt: true,
                fileUrl: true,
                content: true,
              },
            }
          : false,
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return assignments.map((a) => ({
      ...a,
      submission: studentId ? a.submissions?.[0] || null : undefined,
    }));
  },

  async getCourseAssignments(
    tenantId: string,
    courseId: string,
    studentId?: string
  ) {
    const assignments = await prisma.assignment.findMany({
      where: {
        tenantId,
        module: { courseId },
      },
      include: {
        module: {
          select: { id: true, title: true },
        },
        submissions: studentId
          ? {
              where: { studentId },
              select: {
                id: true,
                grade: true,
                feedback: true,
                submittedAt: true,
                gradedAt: true,
                fileUrl: true,
              },
            }
          : false,
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return assignments.map((a) => ({
      ...a,
      submission: studentId ? a.submissions?.[0] || null : undefined,
    }));
  },

  async createAssignment(
    tenantId: string,
    data: {
      moduleId: string;
      title: string;
      description: string;
      dueDate?: string | null;
      maxScore?: number;
    }
  ) {
    const moduleItem = await prisma.module.findFirst({
      where: { id: data.moduleId, tenantId },
    });

    if (!moduleItem) {
      throw AppError.notFound('Module not found');
    }

    return prisma.assignment.create({
      data: {
        tenantId,
        moduleId: data.moduleId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        maxScore: data.maxScore || 100,
      },
    });
  },

  async submitAssignment(
    tenantId: string,
    studentId: string,
    data: { assignmentId: string; content?: string; fileUrl?: string }
  ) {
    const assignment = await prisma.assignment.findFirst({
      where: { id: data.assignmentId, tenantId },
      include: { module: true },
    });

    if (!assignment) {
      throw AppError.notFound('Assignment not found');
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId: assignment.module.courseId,
        },
      },
    });

    if (!enrollment) {
      throw AppError.forbidden(
        'Must be enrolled in course to submit assignment'
      );
    }

    return prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId: data.assignmentId,
          studentId,
        },
      },
      update: {
        content: data.content,
        fileUrl: data.fileUrl,
        submittedAt: new Date(),
      },
      create: {
        tenantId,
        assignmentId: data.assignmentId,
        studentId,
        content: data.content,
        fileUrl: data.fileUrl,
        submittedAt: new Date(),
      },
    });
  },

  async getAssignmentSubmissions(tenantId: string, assignmentId: string) {
    const assignment = await prisma.assignment.findFirst({
      where: { id: assignmentId, tenantId },
    });

    if (!assignment) {
      throw AppError.notFound('Assignment not found');
    }

    return prisma.assignmentSubmission.findMany({
      where: { assignmentId, tenantId },
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
      orderBy: { submittedAt: 'desc' },
    });
  },

  async gradeSubmission(
    tenantId: string,
    submissionId: string,
    data: { grade: number; feedback?: string }
  ) {
    const submission = await prisma.assignmentSubmission.findFirst({
      where: { id: submissionId, tenantId },
      include: { assignment: true },
    });

    if (!submission) {
      throw AppError.notFound('Submission not found');
    }

    if (data.grade > submission.assignment.maxScore) {
      throw AppError.badRequest(
        `Grade cannot exceed maximum score of ${submission.assignment.maxScore}`
      );
    }

    return prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        grade: data.grade,
        feedback: data.feedback,
        gradedAt: new Date(),
      },
    });
  },
};
