import { z } from 'zod';

export const categoriesSchemas = {
  createCategory: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    slug: z.string().min(2, 'Slug must be at least 2 characters').optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    parentId: z.string().nullable().optional(),
  }),
  updateCategory: z.object({
    name: z.string().min(2).optional(),
    slug: z.string().min(2).optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    parentId: z.string().nullable().optional(),
  }),
};
