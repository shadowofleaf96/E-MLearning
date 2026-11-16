import { CorsOptions } from 'cors';
import { env } from './env';

const allowedOrigins = ['http://localhost:3000', env.FRONTEND_URL].filter(
  Boolean
) as string[];

export const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow: boolean) => void
  ) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }

    // Allow exact matches
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any localhost port or subdomains of localhost
    if (/^https?:\/\/(?:[\w-]+\.)?localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }

    // Allow frontend URL and its subdomains
    if (env.FRONTEND_URL) {
      try {
        const frontendUrl = new URL(env.FRONTEND_URL);
        const frontendDomain = frontendUrl.hostname;

        // Check if the origin matches the frontend domain or is a subdomain
        const originUrl = new URL(origin);
        if (
          originUrl.hostname === frontendDomain ||
          originUrl.hostname.endsWith(`.${frontendDomain}`)
        ) {
          return callback(null, true);
        }
      } catch (e) {
        // Ignore invalid URLs
      }
    }

    callback(new Error('Not allowed by CORS'), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Origin',
    'X-Requested-With',
    'Accept',
    'Authorization',
    'X-Tenant-ID',
  ],
  credentials: true,
};
