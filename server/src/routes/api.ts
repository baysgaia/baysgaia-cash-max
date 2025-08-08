import { Router } from 'express';
import kpiRoutes from './kpi';
import cashflowRoutes from './cashflow';
import bankRoutes from './bank';
import subsidyRoutes from './subsidy';
import processRoutes from './process';
import riskRoutes from './risk';
import projectRoutes from './project';

const router = Router();

router.use('/kpi', kpiRoutes);
router.use('/cashflow', cashflowRoutes);
router.use('/bank', bankRoutes);
router.use('/subsidy', subsidyRoutes);
router.use('/process', processRoutes);
router.use('/risk', riskRoutes);
router.use('/project', projectRoutes);

export default router;