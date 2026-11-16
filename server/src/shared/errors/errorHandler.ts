import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';
import { logger } from '../../utils/logger';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      code: err.code,
      message: err.message,
    });
    return;
  }

  // Prisma known errors
  if (err.name === 'PrismaClientKnownRequestError') {
    res.status(400).json({
      status: 'error',
      code: 'DATABASE_ERROR',
      message: 'A database error occurred',
    });
    return;
  }

  // JWT errors
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      status: 'error',
      code: 'TOKEN_EXPIRED',
      message: 'Session expired. Please login again',
    });
    return;
  }

  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      status: 'error',
      code: 'INVALID_TOKEN',
      message: 'Invalid authentication token',
    });
    return;
  }

  // Unexpected errors
  logger.error('Unhandled error:', err);

  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_ERROR',
    message:
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
  });
}
