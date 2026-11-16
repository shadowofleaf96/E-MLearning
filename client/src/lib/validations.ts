import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const registrationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const courseSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  description: z.string().optional(),
  price: z.number().nonnegative('Price must be a non-negative number'),
  isPublished: z.boolean().default(false),
});
