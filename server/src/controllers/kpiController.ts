import { Request, Response, NextFunction } from 'express';
import { calculateKPIs } from '../services/kpiService';
import { logger } from '../utils/logger';

export const getKPIMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const kpis = await calculateKPIs();
    res.json({
      success: true,
      data: kpis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get KPI metrics', error);
    next(error);
  }
};

export const getKPIHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { days = 30 } = req.query;
    const history = await calculateKPIHistory(Number(days));
    res.json({
      success: true,
      data: history,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Failed to get KPI history', error);
    next(error);
  }
};

async function calculateKPIHistory(days: number) {
  return {
    ccc: Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 75 - Math.random() * 5
    })).reverse(),
    dso: Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 65 - Math.random() * 3
    })).reverse(),
    cashBalance: Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 12000000 + Math.random() * 1000000
    })).reverse()
  };
}