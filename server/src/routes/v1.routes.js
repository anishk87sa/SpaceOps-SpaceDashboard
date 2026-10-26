import { Router } from 'express';
import missionsRoutes from './missions.routes.js';
import astronautsRoutes from './astronauts.routes.js';
import launchesRoutes from './launches.routes.js';
import spacecraftRoutes from './spacecraft.routes.js';
import destinationsRoutes from './destinations.routes.js';
import eventsRoutes from './events.routes.js';
import newsRoutes from './news.routes.js';
import learnRoutes from './learn.routes.js';
import searchRoutes from './search.routes.js';
import homeRoutes from './home.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import organizationsRoutes from './organizations.routes.js';
import bookmarksRoutes from './bookmarks.routes.js';
import dataSourcesRoutes from './dataSources.routes.js';
import orbitalRoutes from './orbital.routes.js';
import satellitesRoutes from './satellites.routes.js';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

// Public Space Exploration Discovery Endpoints
router.use('/missions', missionsRoutes);
router.use('/astronauts', astronautsRoutes);
router.use('/launches', launchesRoutes);
router.use('/spacecraft', spacecraftRoutes);
router.use('/destinations', destinationsRoutes);
router.use('/events', eventsRoutes);
router.use('/news', newsRoutes);
router.use('/learn', learnRoutes);
router.use('/search', searchRoutes);
router.use('/home', homeRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/organizations', organizationsRoutes);
router.use('/bookmarks', bookmarksRoutes);
router.use('/sources', dataSourcesRoutes);
router.use('/orbital', orbitalRoutes); // Educational 3D orbit visualization
router.use('/satellites', satellitesRoutes); // Full-fidelity real 3D Satellite Tracking Engine
router.use('/auth', authRoutes); // Optional authentication for personalization
router.use('/health', healthRoutes);

export default router;
