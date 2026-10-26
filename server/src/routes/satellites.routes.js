import { Router } from 'express';
import {
  getSatellites,
  getSatelliteByNoradId,
  getSatellitePosition,
  getSatelliteOrbit,
  getSatelliteCategories,
  getSatellitesStatus,
  refreshSatellites,
} from '../controllers/satellites.controller.js';

const router = Router();

// 1. Catalog & Metadata
router.get('/', getSatellites);
router.get('/categories', getSatelliteCategories);
router.get('/status', getSatellitesStatus);
router.post('/refresh', refreshSatellites);

// 2. Specific Satellite Queries (by NORAD ID)
router.get('/:noradId', getSatelliteByNoradId);
router.get('/:noradId/position', getSatellitePosition);
router.get('/:noradId/orbit', getSatelliteOrbit);

export default router;
