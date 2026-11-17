// @ts-check
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import useragent from 'express-useragent';
import hpp from 'hpp';

import { env, corsOptions, helmetOptions } from './config';
import { errorHandler } from './shared/errors/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { tenantResolver } from './middlewares/tenantResolver';
import { apiLimiter } from './middlewares/rateLimiter';
import prisma from './shared/database/prisma';
import { logger } from './utils/logger';

// Module routes
import { authRoutes } from './modules/auth';
import { usersRoutes } from './modules/users';
import { tenantsRoutes } from './modules/tenants';
import { coursesRoutes } from './modules/courses';
import { categoriesRoutes } from './modules/categories';
import { modulesRoutes } from './modules/modules';
import { lessonsRoutes } from './modules/lessons';
import { examsRoutes } from './modules/exams';
import { codingRoutes } from './modules/coding';
import { paymentsRoutes } from './modules/payments';
import { liveRoutes } from './modules/live';
import { certificatesRoutes } from './modules/certificates';
import { notificationsRoutes } from './modules/notifications';
import { progressRoutes } from './modules/progress';
import uploadRoutes from './modules/uploads/upload.routes';
import { gamificationRoutes } from './modules/gamification';
import { analyticsRoutes } from './modules/analytics';
import { superAdminRoutes } from './modules/super-admin';
import { aiRoutes } from './modules/ai';
import { reviewRoutes } from './modules/reviews';
import { discussionRoutes } from './modules/discussions';
import { bookmarkRoutes } from './modules/bookmarks';
import { searchRoutes } from './modules/search';
import { messagingRoutes } from './modules/messaging';
import { assignmentRoutes } from './modules/assignments';
import tagsRoutes from './modules/tags/tags.routes';
import learningPathsRoutes from './modules/learning-paths/learning-paths.routes';

const app = express();

// ─── Global Middleware ──────────────────────────────────────
app.use(useragent.express());
app.use(cors(corsOptions));
app.use(helmet(helmetOptions));
app.use(hpp());
app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(apiLimiter);

// ─── Static Files ───────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// ─── Tenant Resolution ─────────────────────────────────────
app.use(tenantResolver);

// ─── API Routes (Module Registration) ──────────────────────
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tenants', tenantsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/live', liveRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/learning-paths', learningPathsRoutes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

export default app;
