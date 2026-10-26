import { Router } from 'express';
import { getLaunches, getLaunchBySlug, getUpcomingLaunches } from '../controllers/launches.controller.js';

const router = Router();

router.get('/upcoming', getUpcomingLaunches);
router.get('/', getLaunches);
router.get('/:slug', getLaunchBySlug);

export default router;

