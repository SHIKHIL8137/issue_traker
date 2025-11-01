import express from 'express';
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  acceptAssignment,
  rejectAssignment
} from '../controllers/issueController.js';
import { protect, authorize } from '../middleware/auth.js';


const router = express.Router();

router.use(protect);

router.route('/')
  .post(createIssue)
  .get(getIssues);

router.route('/:id')
  .get(getIssueById)
  .patch(updateIssue)
  .delete(authorize('Admin'), deleteIssue);

router.route('/:id/accept')
  .patch(authorize('Developer'), acceptAssignment);

router.route('/:id/reject')
  .patch(authorize('Developer'), rejectAssignment);

export default router;