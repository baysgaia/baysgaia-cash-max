import { Router } from 'express';
import {
  getAllProcesses,
  getProcessDetails,
  getAutomationOpportunities,
  getAutomationROI,
  getWorkflowTemplates,
  applyWorkflowTemplate
} from '../controllers/processController';

const router = Router();

router.get('/', getAllProcesses);
router.get('/opportunities', getAutomationOpportunities);
router.get('/roi', getAutomationROI);
router.get('/templates', getWorkflowTemplates);
router.get('/:id', getProcessDetails);
router.post('/:id/apply-template', applyWorkflowTemplate);

export default router;