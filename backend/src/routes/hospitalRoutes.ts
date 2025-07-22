import express from 'express';
import hospitalController from '../controllers/hospitalController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import { 
  validateRequest, 
  validateQuery,
  createHospitalSchema,
  updateHospitalSchema,
  searchSchema,
  paginationSchema
} from '../utils/validation';

const router = express.Router();

// Public routes
router.get(
  '/',
  validateQuery(searchSchema.concat(paginationSchema)),
  hospitalController.getHospitals
);

router.get(
  '/:id',
  hospitalController.getHospitalById
);

// Protected routes (hospital admin and above)
router.use(authMiddleware);

router.post(
  '/',
  roleMiddleware(['HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  validateRequest(createHospitalSchema),
  hospitalController.createHospital
);

router.put(
  '/:id',
  roleMiddleware(['HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  validateRequest(updateHospitalSchema),
  hospitalController.updateHospital
);

router.delete(
  '/:id',
  roleMiddleware(['HOSPITAL_ADMIN', 'SYSTEM_ADMIN']),
  hospitalController.deleteHospital
);

export default router;
