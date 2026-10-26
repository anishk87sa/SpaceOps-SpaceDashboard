import { Router } from 'express';
import { getAlerts, acknowledgeAlert, resolveAlert } from '../controllers/alerts.controller.js';

const router = Router();

router.get('/', getAlerts);
router.patch('/:id/acknowledge', acknowledgeAlert);
router.patch('/:id/resolve', resolveAlert);

export default router;
