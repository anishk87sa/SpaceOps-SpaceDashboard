import { env } from '../config/env.js';

/**
 * API Root Controller
 * Endpoint: GET /api
 */
export function getApiRoot(req, res) {
  res.status(200).json({
    name: 'SpaceOps API',
    version: '1.0.0',
    description: 'Public Space Exploration & Discovery Platform API - Missions, Launches, Spacecraft & Astronomical Events',
    environment: env.NODE_ENV,
    endpoints: {
      root: '/api',
      health: '/api/health',
      v1: '/api/v1',
      missions: '/api/v1/missions',
      launches: '/api/v1/launches',
      spacecraft: '/api/v1/spacecraft',
      destinations: '/api/v1/destinations',
      events: '/api/v1/events',
      news: '/api/v1/news',
      learn: '/api/v1/learn',
      search: '/api/v1/search',
      home: '/api/v1/home',
      dashboard: '/api/v1/dashboard',
      sources: '/api/v1/sources'
    },
    documentation: '/docs/API.md',
    timestamp: new Date().toISOString(),
  });
}
