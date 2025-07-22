import express from 'express';
import { doctorController } from '../controllers/doctorController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Doctor routes
router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctorById);
router.put('/:id', doctorController.updateDoctor);
router.get('/:id/blood-requests', doctorController.getDoctorBloodRequests);
router.get('/:id/stats', doctorController.getDoctorStats);

export default router;
