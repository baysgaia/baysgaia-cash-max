import { logger } from '../utils/logger';

export interface CashflowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  balance: number;
}

export async function getCashflowData(period: 'daily' | 'weekly'): Promise<CashflowData[]> {
  try {
    const mockData: CashflowData[] = [];
    const days = period === 'daily' ? 30 : 12;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      if (period === 'daily') {
        date.setDate(date.getDate() - i);
      } else {
        date.setDate(date.getDate() - (i * 7));
      }
      
      const inflow = Math.random() * 2000000 + 1000000;
      const outflow = Math.random() * 1500000 + 800000;
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        inflow,
        outflow,
        netFlow: inflow - outflow,
        balance: 12000000 + (Math.random() - 0.5) * 2000000
      });
    }
    
    return mockData.reverse();
  } catch (error) {
    logger.error('Failed to get cashflow data', error);
    throw error;
  }
}

export function calculateNetCashflow(inflow: number, outflow: number): number {
  return inflow - outflow;
}

export function calculateCashBurnRate(
  totalExpenses: number, 
  periodInDays: number
): number {
  return totalExpenses / periodInDays;
}

export function calculateRunway(
  cashBalance: number, 
  burnRate: number
): number {
  if (burnRate <= 0) return Infinity;
  return cashBalance / burnRate;
}