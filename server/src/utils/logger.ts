/**
 * Structured logger for the application.
 * Wraps console methods with timestamps and log levels.
 * Can be replaced with a proper logging library (pino, winston) later.
 */
export const logger = {
  info(message: string, meta?: Record<string, unknown>): void {
    console.log(
      JSON.stringify({
        level: 'info',
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      })
    );
  },

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(
      JSON.stringify({
        level: 'warn',
        timestamp: new Date().toISOString(),
        message,
        ...meta,
      })
    );
  },

  error(message: string, error?: unknown): void {
    console.error(
      JSON.stringify({
        level: 'error',
        timestamp: new Date().toISOString(),
        message,
        error:
          error instanceof Error
            ? { name: error.name, message: error.message, stack: error.stack }
            : error,
      })
    );
  },

  debug(message: string, meta?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        JSON.stringify({
          level: 'debug',
          timestamp: new Date().toISOString(),
          message,
          ...meta,
        })
      );
    }
  },
};
