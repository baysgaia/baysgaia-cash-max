import axios from 'axios';

const API_BASE = '/api';

export interface KPIHistoryData {
  ccc: Array<{ date: string; value: number }>;
  dso: Array<{ date: string; value: number }>;
  dio: Array<{ date: string; value: number }>;
  dpo: Array<{ date: string; value: number }>;
}

export async function fetchKPIHistory(): Promise<KPIHistoryData> {
  const response = await axios.get(`${API_BASE}/kpi/history?days=30`);
  return response.data.data;
}