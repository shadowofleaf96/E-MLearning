import { z } from 'zod';

const envSchema = z.object({
  // Server
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(5000),

  // Database
  POSTGRESQL_DATABASE_URL: z.string().url(),

  // JWT
  SECRET_ACCESS_TOKEN: z.string().min(32),
  SECRET_REFRESH_TOKEN: z.string().min(32),

  // Frontend
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  // Email (optional in development)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  // Redis (for BullMQ job queues)
  REDIS_URL: z.string(),

  // reCAPTCHA
  RECAPTCHA_SECRET_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    );
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

export const env = validateEnv();
