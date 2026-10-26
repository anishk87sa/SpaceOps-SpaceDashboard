import { Router } from 'express';
import { getPasses } from '../controllers/passes.controller.js';

const router = Router();
router.get('/', getPasses);

export default router;
