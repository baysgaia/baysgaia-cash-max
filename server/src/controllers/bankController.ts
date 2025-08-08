import { Request, Response, NextFunction } from 'express';
import { GMOAozoraAPIService } from '../services/gmoAozoraAPIService';
import { logger } from '../utils/logger';

const bankAPI = new GMOAozoraAPIService();

export const getAccountBalance = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const balance = await bankAPI.getAccountBalance();
    res.json({
      success: true,
      data: balance,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get account balance', error);
    next(error);
  }
};

export const getTransactionHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dateFrom, dateTo } = req.query;
    const transactions = await bankAPI.getTransactionHistory({
      dateFrom: dateFrom as string,
      dateTo: dateTo as string
    });
    
    res.json({
      success: true,
      data: transactions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get transaction history', error);
    next(error);
  }
};