import { Router } from 'express';
import { getOrbitalVisualizationData } from '../controllers/orbital.controller.js';

const router = Router();
router.get('/', getOrbitalVisualizationData);

export default router;
