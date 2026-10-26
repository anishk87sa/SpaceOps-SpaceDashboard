import { Router } from 'express';
import { getDataSources, syncDataSource } from '../controllers/dataSources.controller.js';

const router = Router();

router.get('/', getDataSources);
router.post('/:sourceId/sync', syncDataSource);

export default router;
