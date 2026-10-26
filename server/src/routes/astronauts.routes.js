import { Router } from 'express';
import {
  getAstronauts,
  getAstronautsInSpace,
  getAstronautById,
} from '../controllers/astronauts.controller.js';

const router = Router();

router.get('/in-space', getAstronautsInSpace);
router.get('/', getAstronauts);
router.get('/:id', getAstronautById);

export default router;
