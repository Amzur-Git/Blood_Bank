import express from 'express';
import bloodBankController from '../controllers/bloodBankController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import { 
  validateRequest, 
  validateQuery,
  createBloodBankSchema,
  updateBloodBankSchema,
  searchSchema,
  paginationSchema
} from '../utils/validation';

const router = express.Router();

// Public routes
router.get(
  '/',
  validateQuery(searchSchema.concat(paginationSchema)),
  bloodBankController.getBloodBanks
);

router.get(
  '/:id',
  bloodBankController.getBloodBankById
);

// Protected routes (blood bank admin and above)
router.use(authMiddleware);

router.post(
  '/',
  roleMiddleware(['BLOOD_BANK_ADMIN', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  validateRequest(createBloodBankSchema),
  bloodBankController.createBloodBank
);

router.put(
  '/:id',
  roleMiddleware(['BLOOD_BANK_ADMIN', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  validateRequest(updateBloodBankSchema),
  bloodBankController.updateBloodBank
);

router.delete(
  '/:id',
  roleMiddleware(['BLOOD_BANK_ADMIN', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  bloodBankController.deleteBloodBank
);

export default router;
