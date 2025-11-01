import express from 'express';
import { registerUser, loginUser, logoutUser, getProfile, updateUserRole } from '../controllers/authController.js';
import { protect,  authorize  } from '../middleware/auth.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getProfile);
router.patch('/role', protect, authorize('Admin'), updateUserRole);

export default router;