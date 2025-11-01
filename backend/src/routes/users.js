import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getDevelopers
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/developers', getDevelopers);
router.get('/', authorize('Admin'), getAllUsers);
router.get('/:id', authorize('Admin'), getUserById);
router.patch('/:id/role', authorize('Admin'), updateUserRole);
router.delete('/:id', authorize('Admin'), deleteUser);

export default router;

