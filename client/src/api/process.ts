import axios from 'axios';

const API_BASE = '/api';

export interface Process {
  id: string;
  name: string;
  type: string;
  status: string;
  automationLevel: number;
  metrics: {
    averageExecutionTime: number;
    errorRate: number;
    costSavings: number;
  };
}

export interface AutomationOpportunity {
  processId: string;
  processName: string;
  potentialSavings: {
    timeHours: number;
    costYen: number;
  };
  roi: number;
  implementationDifficulty: string;
  recommendations: string[];
}

export interface AutomationROI {
  currentAutomationLevel: number;
  targetAutomationLevel: number;
  annualSavings: number;
  investmentRequired: number;
  paybackPeriod: number;
}

export async function fetchProcesses(): Promise<Process[]> {
  const response = await axios.get(`${API_BASE}/process`);
  return response.data.data;
}

export async function fetchAutomationOpportunities(): Promise<AutomationOpportunity[]> {
  const response = await axios.get(`${API_BASE}/process/opportunities`);
  return response.data.data;
}

export async function fetchAutomationROI(): Promise<AutomationROI> {
  const response = await axios.get(`${API_BASE}/process/roi`);
  return response.data.data;
}