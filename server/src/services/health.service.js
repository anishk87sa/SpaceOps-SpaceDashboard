import { getDatabaseStatus } from '../config/database.js';
import { env } from '../config/env.js';

/**
 * Health Service
 * Separates data/status gathering from HTTP presentation
 */
export function getHealthStatus() {
  const dbStatus = getDatabaseStatus();
  const uptimeSeconds = Math.floor(process.uptime());

  // Determine overall service status and HTTP response code
  let isOperational = true;
  let statusCode = 200;
  let serviceState = 'operational';

  if (dbStatus.isConfigured && !dbStatus.isConnected) {
    // A configured database dependency is down
    isOperational = false;
    statusCode = 503;
    serviceState = 'degraded_dependency_unavailable';
  } else if (!dbStatus.isConfigured) {
    // Database not yet configured for local development
    serviceState = 'operational_detached_mode';
  }

  return {
    statusCode,
    data: {
      status: isOperational ? 'healthy' : 'degraded',
      serviceState,
      name: 'SpaceOps Backend API',
      version: '1.0.0',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      dependencies: {
        database: {
          configured: dbStatus.isConfigured,
          connected: dbStatus.isConnected,
          status: dbStatus.status,
          message: dbStatus.message,
        },
      },
    },
  };
}
