import { Router } from 'express';
import kpiRoutes from './kpi';
import cashflowRoutes from './cashflow';
import bankRoutes from './bank';

const router = Router();

router.use('/kpi', kpiRoutes);
router.use('/cashflow', cashflowRoutes);
router.use('/bank', bankRoutes);

export default router;