import { Router } from 'express';
import { getSpacecraft, getSpacecraftBySlug } from '../controllers/spacecraft.controller.js';

const router = Router();

router.get('/', getSpacecraft);
router.get('/:slug', getSpacecraftBySlug);

export default router;
