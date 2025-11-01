import express from 'express';
import { getAllAuditLogs, getAuditLogsByIssue } from '../controllers/auditController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Admin: list all audit logs with pagination
router.get('/', authorize('Admin'), getAllAuditLogs);

// Any authenticated: list logs for a specific issue they can see
router.get('/issue/:issueId', getAuditLogsByIssue);

export default router;


