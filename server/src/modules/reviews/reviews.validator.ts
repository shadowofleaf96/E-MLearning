import { z } from 'zod';

export const reviewSchemas = {
  createReview: {
    body: z.object({
      courseId: z.string().uuid(),
      rating: z.number().int().min(1).max(5),
      comment: z.string().optional(),
    }),
  },
  updateReview: {
    body: z.object({
      rating: z.number().int().min(1).max(5).optional(),
      comment: z.string().optional(),
    }),
  },
};
