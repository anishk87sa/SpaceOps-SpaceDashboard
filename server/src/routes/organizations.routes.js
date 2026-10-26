import { Router } from 'express';
import { getOrganizations } from '../controllers/organizations.controller.js';

const router = Router();

router.get('/', getOrganizations);

export default router;
