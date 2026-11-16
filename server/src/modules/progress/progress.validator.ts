import { z } from 'zod';

const updateProgressSchema = z
  .object({
    progressPercentage: z.number().int().min(0).max(100).optional(),
    completed: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.progressPercentage !== undefined || data.completed !== undefined,
    {
      message:
        'At least one of progressPercentage or completed must be provided',
    }
  );

const updateLessonProgressSchema = z.object({
  completed: z.boolean().optional(),
  timeSpent: z.number().int().min(0).optional(),
});

const saveNoteSchema = z.object({
  courseId: z.string().uuid(),
  lessonId: z.string().uuid().optional(),
  content: z.string().min(1),
});

export const progressSchemas = {
  updateProgressSchema: {
    body: updateProgressSchema,
  },
  updateLessonProgressSchema: {
    body: updateLessonProgressSchema,
  },
  saveNoteSchema: {
    body: saveNoteSchema,
  },
};
