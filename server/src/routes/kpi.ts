import { Router } from 'express';
import { getKPIMetrics, getKPIHistory } from '../controllers/kpiController';

const router = Router();

router.get('/current', getKPIMetrics);
router.get('/history', getKPIHistory);

export default router;