import { Router } from 'express';
import {
  getAllRisks,
  getRiskMatrix,
  getActiveAlerts,
  updateRiskAssessment,
  getGovernancePolicies,
  getComplianceStatus,
  generateRiskReport
} from '../controllers/riskController';

const router = Router();

router.get('/', getAllRisks);
router.get('/matrix', getRiskMatrix);
router.get('/alerts', getActiveAlerts);
router.get('/governance', getGovernancePolicies);
router.get('/compliance', getComplianceStatus);
router.get('/report', generateRiskReport);
router.put('/:id/assessment', updateRiskAssessment);

export default router;