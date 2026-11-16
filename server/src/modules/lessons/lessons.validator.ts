import { z } from 'zod';

export const lessonsSchemas = {
  createLesson: z.object({
    moduleId: z.string().uuid(),
    title: z.string().min(1, 'Title is required'),
    type: z.enum(['video', 'pdf', 'text', 'quiz', 'link']),
    contentUrl: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    duration: z.coerce.number().int().min(0).optional(),
    orderIndex: z.coerce.number().int().min(0).optional(),
    publishAt: z.string().datetime().optional().nullable(),
  }),
  updateLesson: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    type: z.enum(['video', 'pdf', 'text', 'quiz', 'link']).optional(),
    contentUrl: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    duration: z.coerce.number().int().min(0).optional(),
    orderIndex: z.coerce.number().int().min(0).optional(),
    publishAt: z.string().datetime().optional().nullable(),
  }),
  reorderLessons: z.object({
    moduleId: z.string().uuid(),
    lessons: z.array(
      z.object({
        id: z.string().uuid(),
        orderIndex: z.coerce.number().int().min(0),
      })
    ),
  }),
};
