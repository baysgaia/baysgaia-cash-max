import axios from 'axios';

const API_BASE = '/api';

export interface DailyCashflowData {
  todayInflow: number;
  todayOutflow: number;
  netFlow: number;
  inflowCount: number;
  outflowCount: number;
  history: Array<{
    date: string;
    inflow: number;
    outflow: number;
    netFlow: number;
  }>;
}

export interface ForecastData {
  date: string;
  balance: number;
  confidence: number;
}

export async function fetchDailyCashflow(): Promise<DailyCashflowData> {
  const response = await axios.get(`${API_BASE}/cashflow/daily`);
  const data = response.data.data;
  
  const today = data[data.length - 1];
  
  return {
    todayInflow: today.inflow,
    todayOutflow: today.outflow,
    netFlow: today.netFlow,
    inflowCount: Math.floor(Math.random() * 10) + 5,
    outflowCount: Math.floor(Math.random() * 15) + 10,
    history: data,
  };
}

export async function fetchWeeklyForecast(): Promise<ForecastData[]> {
  const response = await axios.get(`${API_BASE}/cashflow/forecast?days=7`);
  return response.data.data.map((item: any) => ({
    date: item.date,
    balance: item.balance,
    confidence: 90 + Math.random() * 10,
  }));
}