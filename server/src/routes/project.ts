import { Router } from 'express';
import {
  getProject,
  getAllPhases,
  getCurrentPhase,
  updateObjectiveProgress,
  getProjectTimeline,
  generateProjectReport,
  getGanttChartData
} from '../controllers/projectController';

const router = Router();

router.get('/', getProject);
router.get('/phases', getAllPhases);
router.get('/current-phase', getCurrentPhase);
router.get('/timeline', getProjectTimeline);
router.get('/report', generateProjectReport);
router.get('/gantt', getGanttChartData);
router.put('/objectives/:id/progress', updateObjectiveProgress);

export default router;