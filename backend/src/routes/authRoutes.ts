import express from 'express';
import authController from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { 
  validateRequest,
  registerUserSchema,
  loginUserSchema
} from '../utils/validation';

const router = express.Router();

// Public routes
router.post(
  '/register',
  validateRequest(registerUserSchema),
  authController.register
);

router.post(
  '/login',
  validateRequest(loginUserSchema),
  authController.login
);

// Protected routes
router.use(authMiddleware);

router.get('/profile', authController.getProfile);

router.put(
  '/profile',
  authController.updateProfile
);

router.post(
  '/change-password',
  authController.changePassword
);

router.post('/refresh-token', authController.refreshToken);

router.post('/logout', authController.logout);

export default router;
