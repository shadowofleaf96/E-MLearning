// TODO: Configure BullMQ queue when Redis is available
// import { Queue, Worker } from 'bullmq';
// import { env } from '../config/env';

/**
 * Job queue setup placeholder.
 * Will use BullMQ with Redis for:
 * - Email sending
 * - Code execution
 * - Certificate generation
 * - Notification dispatching
 */

export const QUEUE_NAMES = {
  EMAIL: 'email-queue',
  CODE_RUNNER: 'code-runner-queue',
  CERTIFICATE: 'certificate-queue',
  NOTIFICATION: 'notification-queue',
} as const;

// TODO: Initialize queues when Redis is configured
// export const emailQueue = new Queue(QUEUE_NAMES.EMAIL, { connection: { url: env.REDIS_URL } });
// export const codeRunnerQueue = new Queue(QUEUE_NAMES.CODE_RUNNER, { connection: { url: env.REDIS_URL } });
