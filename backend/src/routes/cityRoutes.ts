import express from 'express';
import cityController from '../controllers/cityController';
import { authMiddleware, roleMiddleware, optionalAuth } from '../middleware/auth';
import { 
  validateRequest, 
  validateQuery,
  createCitySchema,
  updateCitySchema,
  searchSchema,
  paginationSchema
} from '../utils/validation';

const router = express.Router();

// Public routes
router.get(
  '/',
  validateQuery(searchSchema.concat(paginationSchema)),
  cityController.getCities
);

router.get(
  '/:id',
  cityController.getCityById
);

router.get(
  '/blood-availability',
  cityController.getCitiesWithBloodAvailability
);

// Protected routes (system admin only)
router.use(authMiddleware);
router.use(roleMiddleware(['SYSTEM_ADMIN']));

router.post(
  '/',
  validateRequest(createCitySchema),
  cityController.createCity
);

router.put(
  '/:id',
  validateRequest(updateCitySchema),
  cityController.updateCity
);

router.delete(
  '/:id',
  cityController.deleteCity
);

export default router;
