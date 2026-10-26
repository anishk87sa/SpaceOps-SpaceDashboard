import { Router } from 'express';
import { getEvents, getEventBySlug } from '../controllers/events.controller.js';

const router = Router();

router.get('/', getEvents);
router.get('/:slug', getEventBySlug);

export default router;
