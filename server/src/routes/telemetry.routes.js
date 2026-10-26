import { Router } from 'express';
import { getTelemetry } from '../controllers/telemetry.controller.js';

const router = Router();
router.get('/', getTelemetry);

export default router;
