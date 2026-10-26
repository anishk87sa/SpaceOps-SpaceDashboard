import { getHealthStatus } from '../services/health.service.js';

/**
 * Health check controller
 * Endpoint: GET /api/health
 */
export function getHealth(req, res) {
  const { statusCode, data } = getHealthStatus();
  res.status(statusCode).json(data);
}
