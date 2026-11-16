import { z } from 'zod';

export const modulesSchemas = {
  createModule: z.object({
    courseId: z.string().uuid(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional().nullable(),
    orderIndex: z.coerce.number().int().min(0),
    isLocked: z.boolean().optional(),
    publishAt: z.string().datetime().optional().nullable(),
  }),
  updateModule: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional().nullable(),
    orderIndex: z.coerce.number().int().min(0).optional(),
    isLocked: z.boolean().optional(),
    publishAt: z.string().datetime().optional().nullable(),
  }),
  reorderModules: z.object({
    courseId: z.string().uuid(),
    modules: z.array(
      z.object({
        id: z.string().uuid(),
        orderIndex: z.coerce.number().int().min(0),
      })
    ),
  }),
};
