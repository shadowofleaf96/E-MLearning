import { z } from 'zod';

export const discussionSchemas = {
  createDiscussion: {
    body: z.object({
      courseId: z.string().uuid(),
      lessonId: z.string().uuid().optional(),
      title: z.string().min(3).max(255),
      content: z.string().min(5),
    }),
  },
  createReply: {
    body: z.object({
      discussionId: z.string().uuid(),
      content: z.string().min(2),
    }),
  },
};
