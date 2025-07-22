import express from 'express';
import { patientController } from '../controllers/patientController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Patient routes
router.get('/', patientController.getPatients);
router.get('/blood-type/:bloodType', patientController.getPatientsByBloodType);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatient);
router.get('/:id/blood-requests', patientController.getPatientBloodRequests);
router.post('/:id/blood-requests', patientController.createBloodRequest);
router.get('/:id/medical-history', patientController.getPatientMedicalHistory);

export default router;
