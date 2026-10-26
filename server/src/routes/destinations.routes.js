import { Router } from 'express';
import { getDestinations, getDestinationBySlug } from '../controllers/destinations.controller.js';

const router = Router();

router.get('/', getDestinations);
router.get('/:slug', getDestinationBySlug);

export default router;
