import * as cron from 'node-cron';
import { logger } from '../utils/logger';
import { GMOAozoraAPIService } from './gmoAozoraAPIService';
import { calculateKPIs } from './kpiService';

const bankAPI = new GMOAozoraAPIService();

export function startScheduledJobs() {
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running daily morning data sync...');
    try {
      await syncBankData();
      await updateKPIs();
      logger.info('Daily morning sync completed');
    } catch (error) {
      logger.error('Daily morning sync failed:', error);
    }
  });

  cron.schedule('0 18 * * *', async () => {
    logger.info('Running daily evening data sync...');
    try {
      await syncBankData();
      await updateKPIs();
      logger.info('Daily evening sync completed');
    } catch (error) {
      logger.error('Daily evening sync failed:', error);
    }
  });

  cron.schedule('*/5 * * * *', async () => {
    logger.debug('Running 5-minute balance check...');
    try {
      await checkBalanceAlerts();
    } catch (error) {
      logger.error('Balance check failed:', error);
    }
  });

  logger.info('Scheduled jobs started');
}

async function syncBankData() {
  try {
    const balance = await bankAPI.getAccountBalance();
    logger.info('Bank balance synced:', balance.balance);
    
    const transactions = await bankAPI.getTransactionHistory({ limit: 100 });
    logger.info(`Synced ${transactions.length} transactions`);
  } catch (error) {
    logger.error('Bank data sync failed:', error);
    throw error;
  }
}

async function updateKPIs() {
  try {
    const kpis = await calculateKPIs();
    logger.info('KPIs updated:', kpis);
  } catch (error) {
    logger.error('KPI update failed:', error);
    throw error;
  }
}

async function checkBalanceAlerts() {
  try {
    const balance = await bankAPI.getAccountBalance();
    
    if (balance.balance < 5000000) {
      logger.warn('Low balance alert:', balance.balance);
    }
    
    if (balance.balance < 3000000) {
      logger.error('Critical balance alert:', balance.balance);
    }
  } catch (error) {
    logger.error('Balance alert check failed:', error);
  }
}