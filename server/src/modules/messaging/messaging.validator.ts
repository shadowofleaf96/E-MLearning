import { z } from 'zod';

export const messagingSchemas = {
  sendMessage: {
    body: z.object({
      recipientId: z.string().uuid(),
      content: z.string().min(1).max(5000),
      fileUrl: z.string().url().optional(),
    }),
  },
};
