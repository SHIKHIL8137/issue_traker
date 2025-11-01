import express from 'express';
import {
  getAdminStats,
  getDeveloperStats,
  getUserStats
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/admin', authorize('Admin'), getAdminStats);
router.get('/developer', authorize('Developer', 'Admin'), getDeveloperStats);
router.get('/user', getUserStats);

export default router;

