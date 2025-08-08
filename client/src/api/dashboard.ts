import axios from 'axios';

const API_BASE = '/api';

export interface KPIData {
  ccc: number;
  dso: number;
  dio: number;
  dpo: number;
  forecastAccuracy: number;
  automationRate: number;
}

export interface CashBalance {
  balance: number;
  changePercent: number;
  lastUpdated: string;
}

export interface CashBalanceHistory {
  date: string;
  balance: number;
}

export async function fetchKPIs(): Promise<KPIData> {
  const response = await axios.get(`${API_BASE}/kpi/current`);
  return response.data.data;
}

export async function fetchCashBalance(): Promise<CashBalance> {
  const response = await axios.get(`${API_BASE}/bank/balance`);
  return {
    balance: response.data.data.balance,
    changePercent: 5.2,
    lastUpdated: response.data.data.lastUpdated,
  };
}

export async function fetchCashBalanceHistory(): Promise<CashBalanceHistory[]> {
  const response = await axios.get(`${API_BASE}/kpi/history?days=30`);
  return response.data.data.cashBalance;
}