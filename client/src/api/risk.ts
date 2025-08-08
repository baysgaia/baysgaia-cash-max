import axios from 'axios';

const API_BASE = '/api';

export interface Risk {
  id: string;
  name: string;
  description: string;
  impact: number;
  probability: number;
  riskScore: number;
  owner: string;
  mitigationActions: Array<{
    id: string;
    action: string;
    status: string;
  }>;
}

export interface RiskMatrix {
  highImpactHighProb: Risk[];
  highImpactMedProb: Risk[];
  highImpactLowProb: Risk[];
  medImpactHighProb: Risk[];
  medImpactMedProb: Risk[];
  medImpactLowProb: Risk[];
  lowImpactHighProb: Risk[];
  lowImpactMedProb: Risk[];
  lowImpactLowProb: Risk[];
}

export interface RiskAlert {
  id: string;
  message: string;
  severity: string;
}

export interface ComplianceStatus {
  totalCheckpoints: number;
  compliant: number;
  nonCompliant: number;
  pending: number;
  complianceRate: number;
  upcomingChecks: Array<{
    id: string;
    name: string;
    nextCheck: string;
  }>;
}

export async function fetchRisks(): Promise<Risk[]> {
  const response = await axios.get(`${API_BASE}/risk`);
  return response.data.data;
}

export async function fetchRiskMatrix(): Promise<RiskMatrix> {
  const response = await axios.get(`${API_BASE}/risk/matrix`);
  return response.data.data;
}

export async function fetchActiveAlerts(): Promise<RiskAlert[]> {
  const response = await axios.get(`${API_BASE}/risk/alerts`);
  return response.data.data;
}

export async function fetchComplianceStatus(): Promise<ComplianceStatus> {
  const response = await axios.get(`${API_BASE}/risk/compliance`);
  return response.data.data;
}