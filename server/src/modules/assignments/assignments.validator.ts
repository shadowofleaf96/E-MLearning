import { z } from 'zod';

export const assignmentSchemas = {
  createAssignment: {
    body: z.object({
      moduleId: z.string().uuid(),
      title: z.string().min(2).max(255),
      description: z.string().min(5),
      dueDate: z.string().datetime().optional().nullable(),
      maxScore: z.number().int().min(1).default(100),
    }),
  },
  submitAssignment: {
    body: z.object({
      assignmentId: z.string().uuid(),
      content: z.string().optional(),
      fileUrl: z.string().optional(),
    }),
  },
  gradeSubmission: {
    body: z.object({
      grade: z.number().int().min(0),
      feedback: z.string().optional(),
    }),
  },
};
