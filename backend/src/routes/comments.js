import express from 'express';
import { addComment, getCommentsByIssue } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', addComment);

router.get('/issue/:issueId', getCommentsByIssue);

export default router;