import { Router } from 'express';
import { getDailyCashflow, getWeeklyCashflow, getCashflowForecast } from '../controllers/cashflowController';

const router = Router();

router.get('/daily', getDailyCashflow);
router.get('/weekly', getWeeklyCashflow);
router.get('/forecast', getCashflowForecast);

export default router;