import { z } from 'zod';

export const authSchemas = {
  register: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    tenantId: z.string().uuid().optional(),
  }),

  login: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),

  forgotPassword: z.object({
    email: z.string().email(),
  }),

  resetPassword: z.object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  }),

  findInstitutes: z.object({
    email: z.string().email(),
  }),
};
