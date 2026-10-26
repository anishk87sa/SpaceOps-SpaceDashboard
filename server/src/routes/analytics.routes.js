import { Router } from 'express';
import { getAnalytics, generateReport } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/', getAnalytics);
router.post('/report', generateReport);

export default router;
