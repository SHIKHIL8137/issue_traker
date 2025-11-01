import express from 'express';
import { addComment, getCommentsByIssue } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Add comment to an issue
router.post('/', addComment);

// Get all comments for an issue
router.get('/issue/:issueId', getCommentsByIssue);

export default router;

