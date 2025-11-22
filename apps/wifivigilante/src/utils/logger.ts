// src/utils/logger.ts

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

interface LogContext {
  component?: string;
  userId?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDev = import.meta.env.DEV;

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    };

    // Console output in development
    if (this.isDev) {
      const consoleMethod = level === 'error' || level === 'fatal'
        ? console.error
        : level === 'warn'
          ? console.warn
          : console.log;
      consoleMethod(`[${level.toUpperCase()}]`, message, context, error);
    }

    // Send to logging service in production (future enhancement)
    if (!this.isDev && (level === 'error' || level === 'fatal')) {
      this.sendToLoggingService(logEntry);
    }

    return logEntry;
  }

  private sendToLoggingService(entry: unknown) {
    // Future: Implement based on your logging service
    // Examples: Sentry, LogRocket, Datadog, CloudWatch
    // For now, just log to console.error in production
    console.error('Production Error:', entry);
  }

  debug(message: string, context?: LogContext) {
    return this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext) {
    return this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext) {
    return this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: LogContext, error?: Error) {
    return this.log(LogLevel.ERROR, message, context, error);
  }

  fatal(message: string, context?: LogContext, error?: Error) {
    return this.log(LogLevel.FATAL, message, context, error);
  }
}

export const logger = new Logger();
