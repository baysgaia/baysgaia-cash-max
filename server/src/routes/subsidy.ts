import { Router } from 'express';
import {
  getAllSubsidies,
  getSubsidyDetails,
  updateSubsidyStatus,
  getFundingSimulation,
  getApplicationChecklist
} from '../controllers/subsidyController';

const router = Router();

router.get('/', getAllSubsidies);
router.get('/simulation', getFundingSimulation);
router.get('/:id', getSubsidyDetails);
router.put('/:id/status', updateSubsidyStatus);
router.get('/:id/checklist', getApplicationChecklist);

export default router;