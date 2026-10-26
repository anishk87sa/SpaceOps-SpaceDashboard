import { Router } from 'express';
import { getMissions, getMissionBySlug } from '../controllers/missions.controller.js';

const router = Router();

router.get('/', getMissions);
router.get('/:slug', getMissionBySlug);

export default router;
