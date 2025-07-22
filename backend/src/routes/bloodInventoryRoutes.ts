import express from 'express';
import bloodInventoryController from '../controllers/bloodInventoryController';
import { authMiddleware, roleMiddleware, optionalAuth } from '../middleware/auth';
import { 
  validateRequest, 
  validateQuery,
  createBloodInventorySchema,
  updateBloodInventorySchema,
  emergencySearchSchema,
  searchSchema,
  paginationSchema
} from '../utils/validation';

const router = express.Router();

// Public routes (no authentication required)
router.get(
  '/availability',
  validateQuery(searchSchema.concat(paginationSchema)),
  bloodInventoryController.getBloodAvailability
);

router.get(
  '/emergency/availability',
  validateQuery(emergencySearchSchema),
  bloodInventoryController.getEmergencyBloodAvailability
);

router.get(
  '/city/:cityId/summary',
  bloodInventoryController.getCityBloodSummary
);

// Protected routes (authentication required)
router.use(authMiddleware);

router.get(
  '/blood-bank/:bloodBankId',
  bloodInventoryController.getBloodInventory
);

router.get(
  '/blood-bank/:bloodBankId/stats',
  bloodInventoryController.getBloodBankStats
);

router.get(
  '/expired',
  roleMiddleware(['BLOOD_BANK_ADMIN', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  bloodInventoryController.getExpiredBloodInventory
);

router.get(
  '/low-stock',
  roleMiddleware(['BLOOD_BANK_ADMIN', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  bloodInventoryController.getLowStockAlerts
);

// Admin routes (blood bank admin and above)
router.post(
  '/',
  roleMiddleware(['BLOOD_BANK_ADMIN', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  validateRequest(createBloodInventorySchema),
  bloodInventoryController.createBloodInventory
);

router.put(
  '/:id',
  roleMiddleware(['BLOOD_BANK_ADMIN', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  validateRequest(updateBloodInventorySchema),
  bloodInventoryController.updateBloodInventory
);

router.delete(
  '/:id',
  roleMiddleware(['BLOOD_BANK_ADMIN', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  bloodInventoryController.deleteBloodInventory
);

export default router;
