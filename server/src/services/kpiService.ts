import { logger } from '../utils/logger';

export interface KPIMetrics {
  ccc: number;
  dso: number;
  dio: number;
  dpo: number;
  cashBalance: number;
  monthlyGrowth: number;
  forecastAccuracy: number;
  automationRate: number;
}

export async function calculateKPIs(): Promise<KPIMetrics> {
  try {
    const currentMetrics: KPIMetrics = {
      ccc: 75,
      dso: 65,
      dio: 30,
      dpo: 20,
      cashBalance: 12345678,
      monthlyGrowth: 5.2,
      forecastAccuracy: 92.5,
      automationRate: 35
    };

    return currentMetrics;
  } catch (error) {
    logger.error('Failed to calculate KPIs', error);
    throw error;
  }
}

export function calculateCCC(dso: number, dio: number, dpo: number): number {
  return dso + dio - dpo;
}

export function calculateDSO(receivables: number, revenue: number, days: number = 365): number {
  if (revenue === 0) return 0;
  return (receivables / revenue) * days;
}

export function calculateDIO(inventory: number, cogs: number, days: number = 365): number {
  if (cogs === 0) return 0;
  return (inventory / cogs) * days;
}

export function calculateDPO(payables: number, purchases: number, days: number = 365): number {
  if (purchases === 0) return 0;
  return (payables / purchases) * days;
}