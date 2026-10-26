import { Router } from 'express';
import {
  getOrganizationProfile,
  getTeam,
  getAuditLogs,
  inviteMember,
} from '../controllers/organization.controller.js';

const router = Router();

router.get('/', getOrganizationProfile);
router.get('/team', getTeam);
router.post('/team/invite', inviteMember);
router.get('/audit-logs', getAuditLogs);

export default router;
