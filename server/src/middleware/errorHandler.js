import { env } from '../config/env.js';

/**
 * Centralized Application Error Handler Middleware
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const isProduction = env.NODE_ENV === 'production';

  // Handle body-parser / express.json() SyntaxErrors gracefully
  let message = err.message || 'Internal server error';
  let errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  if (err instanceof SyntaxError && (err.status === 400 || statusCode === 400) && 'body' in err) {
    errorCode = 'INVALID_JSON';
    message = 'Invalid JSON payload received in request body. Ensure data is valid JSON.';
  } else if (isProduction && statusCode === 500) {
    message = 'An unexpected error occurred on the server';
  }

  // Log error details for server diagnostics
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    error: {
      code: errorCode,
      message,
      ...(isProduction ? {} : { stack: err.stack }),
    },
    timestamp: new Date().toISOString(),
  });
}
