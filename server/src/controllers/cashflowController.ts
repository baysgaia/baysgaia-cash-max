import { Request, Response, NextFunction } from 'express';
import { getCashflowData } from '../services/cashflowService';
import { logger } from '../utils/logger';

export const getDailyCashflow = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCashflowData('daily');
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get daily cashflow', error);
    next(error);
  }
};

export const getWeeklyCashflow = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCashflowData('weekly');
    res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get weekly cashflow', error);
    next(error);
  }
};

export const getCashflowForecast = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { days = 7 } = req.query;
    const forecast = await generateCashflowForecast(Number(days));
    res.json({
      success: true,
      data: forecast,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get cashflow forecast', error);
    next(error);
  }
};

async function generateCashflowForecast(days: number) {
  const forecast = [];
  const baseBalance = 12000000;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      inflow: Math.random() * 2000000 + 1000000,
      outflow: Math.random() * 1500000 + 800000,
      balance: baseBalance + (Math.random() - 0.5) * 1000000
    });
  }
  
  return forecast;
}