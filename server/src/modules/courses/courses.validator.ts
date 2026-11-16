import { z } from 'zod';

export const coursesSchemas = {
  createCourse: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional().nullable(),
    price: z.coerce
      .number()
      .min(0, 'Price must be a non-negative number')
      .optional(),
    thumbnail: z.string().optional().nullable(),
    isPublished: z.boolean().optional(),
    categoryId: z.string().optional().nullable(),
  }),
  updateCourse: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional().nullable(),
    price: z.coerce
      .number()
      .min(0, 'Price must be a non-negative number')
      .optional(),
    thumbnail: z.string().optional().nullable(),
    isPublished: z.boolean().optional(),
    categoryId: z.string().optional().nullable(),
  }),
};
