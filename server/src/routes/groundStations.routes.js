import { Router } from 'express';
import { getGroundStations, getGroundStationById } from '../controllers/groundStations.controller.js';

const router = Router();
router.get('/', getGroundStations);
router.get('/:id', getGroundStationById);

export default router;
