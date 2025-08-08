import axios from 'axios';

const API_BASE = '/api';

export interface Subsidy {
  id: string;
  name: string;
  type: 'grant' | 'loan' | 'subsidy';
  provider: string;
  maxAmount: number;
  applicationDeadline: string;
  status: string;
  approvedAmount?: number;
}

export interface FundingSimulation {
  totalRequiredFunding: number;
  subsidies: Array<{
    subsidy: Subsidy;
    probability: number;
    expectedAmount: number;
    expectedDate: string;
  }>;
  loans: Array<{
    lender: string;
    amount: number;
    interestRate: number;
  }>;
}

export async function fetchSubsidies(): Promise<Subsidy[]> {
  const response = await axios.get(`${API_BASE}/subsidy`);
  return response.data.data;
}

export async function fetchFundingSimulation(): Promise<FundingSimulation> {
  const response = await axios.get(`${API_BASE}/subsidy/simulation`);
  return response.data.data;
}