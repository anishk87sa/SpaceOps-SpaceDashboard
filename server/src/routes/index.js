import { Router } from 'express';
import { getApiRoot } from '../controllers/root.controller.js';
import healthRoutes from './health.routes.js';
import v1Routes from './v1.routes.js';
import satellitesRoutes from './satellites.routes.js';

const router = Router();

// API Base Information
router.get('/', getApiRoot);

// Root Health Check
router.use('/health', healthRoutes);

// Satellites API (Direct /api/satellites alias)
router.use('/satellites', satellitesRoutes);

// Version 1 Master API
router.use('/v1', v1Routes);

export default router;
