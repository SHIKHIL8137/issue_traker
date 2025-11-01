import express from 'express';
import { getAllAuditLogs, getAuditLogsByIssue } from '../controllers/auditController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('Admin'), getAllAuditLogs);

router.get('/issue/:issueId', getAuditLogsByIssue);

export default router;