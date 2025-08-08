// import axios from 'axios';

// const API_BASE = '/api';

export interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

export async function fetchAlerts(): Promise<Alert[]> {
  const mockAlerts: Alert[] = [
    {
      id: '1',
      level: 'warning',
      message: 'DSO が目標値を 5% 超過しています。売掛金回収の確認が必要です。',
      timestamp: new Date().toISOString(),
    },
  ];
  
  return mockAlerts;
}