import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

interface AccountBalance {
  accountId: string;
  accountName: string;
  balance: number;
  availableBalance: number;
  currency: string;
  lastUpdated: string;
}

interface Transaction {
  transactionId: string;
  date: string;
  description: string;
  amount: number;
  balance: number;
  type: 'debit' | 'credit';
  category: string;
}

export class GMOAozoraAPIService {
  private apiClient: AxiosInstance;
  private baseURL: string;
  private accessToken: string | null = null;

  constructor() {
    this.baseURL = process.env.GMO_AOZORA_API_URL || 'https://api.gmo-aozora.com/ganb/api/personal/v1';
    
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.apiClient.interceptors.request.use(
      async (config) => {
        if (!this.accessToken) {
          await this.authenticate();
        }
        config.headers.Authorization = `Bearer ${this.accessToken}`;
        return config;
      },
      (error) => {
        logger.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          logger.info('Token expired, re-authenticating...');
          await this.authenticate();
          error.config.headers.Authorization = `Bearer ${this.accessToken}`;
          return this.apiClient.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  private async authenticate(): Promise<void> {
    try {
      logger.info('GMO Aozora API Mock Authentication');
      this.accessToken = 'mock-access-token';
      
    } catch (error) {
      logger.error('Authentication failed:', error);
      throw new Error('Failed to authenticate with GMO Aozora API');
    }
  }

  async getAccountBalance(): Promise<AccountBalance> {
    try {
      const mockBalance: AccountBalance = {
        accountId: 'ACC001',
        accountName: 'ベイスガイア運転資金口座',
        balance: 12345678,
        availableBalance: 12345678,
        currency: 'JPY',
        lastUpdated: new Date().toISOString()
      };
      
      return mockBalance;
    } catch (error) {
      logger.error('Failed to get account balance:', error);
      throw error;
    }
  }

  async getTransactionHistory(params: {
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }): Promise<Transaction[]> {
    try {
      const transactions: Transaction[] = [];
      const days = 30;
      
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const dailyTransactions = Math.floor(Math.random() * 5) + 1;
        
        for (let j = 0; j < dailyTransactions; j++) {
          const isCredit = Math.random() > 0.4;
          const amount = Math.floor(Math.random() * 1000000) + 10000;
          
          transactions.push({
            transactionId: `TXN${date.getTime()}${j}`,
            date: date.toISOString(),
            description: isCredit ? `売掛金入金 - 顧客${Math.floor(Math.random() * 100)}` : `支払い - 取引先${Math.floor(Math.random() * 50)}`,
            amount: amount,
            balance: 12000000 + (Math.random() - 0.5) * 2000000,
            type: isCredit ? 'credit' : 'debit',
            category: isCredit ? 'revenue' : 'expense'
          });
        }
      }
      
      return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      logger.error('Failed to get transaction history:', error);
      throw error;
    }
  }

  async initiateTransfer(params: {
    toAccount: string;
    amount: number;
    description: string;
  }): Promise<{ transferId: string; status: string }> {
    try {
      logger.info('Initiating transfer:', params);
      
      return {
        transferId: `TRF${Date.now()}`,
        status: 'pending'
      };
    } catch (error) {
      logger.error('Failed to initiate transfer:', error);
      throw error;
    }
  }
}