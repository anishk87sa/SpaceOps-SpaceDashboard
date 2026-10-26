import { Router } from 'express';
import { getDashboardOverview } from '../controllers/dashboard.controller.js';

const router = Router();
router.get('/', getDashboardOverview);

export default router;
