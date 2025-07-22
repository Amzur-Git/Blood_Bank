import express from 'express';
import bloodRequestController from '../controllers/bloodRequestController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import { 
  validateRequest, 
  validateQuery,
  createBloodRequestSchema,
  updateBloodRequestSchema,
  searchSchema,
  paginationSchema
} from '../utils/validation';

const router = express.Router();

// Public routes (for emergency viewing)
router.get(
  '/public/:id',
  bloodRequestController.getPublicBloodRequest
);

// Protected routes (authentication required)
router.use(authMiddleware);

router.get(
  '/',
  validateQuery(searchSchema.concat(paginationSchema)),
  bloodRequestController.getBloodRequests
);

router.get(
  '/:id',
  bloodRequestController.getBloodRequestById
);

router.post(
  '/',
  roleMiddleware(['DOCTOR', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  validateRequest(createBloodRequestSchema),
  bloodRequestController.createBloodRequest
);

router.put(
  '/:id',
  roleMiddleware(['DOCTOR', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  validateRequest(updateBloodRequestSchema),
  bloodRequestController.updateBloodRequest
);

router.delete(
  '/:id',
  roleMiddleware(['DOCTOR', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  bloodRequestController.deleteBloodRequest
);

// Update request status
router.patch(
  '/:id/status',
  roleMiddleware(['BLOOD_BANK_ADMIN', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  bloodRequestController.updateRequestStatus
);

export default router;
