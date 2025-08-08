import { Router } from 'express';
import { getAccountBalance, getTransactionHistory } from '../controllers/bankController';

const router = Router();

router.get('/balance', getAccountBalance);
router.get('/transactions', getTransactionHistory);

export default router;