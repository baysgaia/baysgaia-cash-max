export interface Subsidy {
  id: string;
  name: string;
  type: 'grant' | 'loan' | 'subsidy';
  provider: string;
  maxAmount: number;
  applicationDeadline: Date;
  status: 'preparing' | 'applied' | 'approved' | 'rejected' | 'received';
  appliedAmount?: number;
  approvedAmount?: number;
  receivedAmount?: number;
  documents: SubsidyDocument[];
  timeline: SubsidyTimeline[];
  requirements: string[];
  notes?: string;
}

export interface SubsidyDocument {
  id: string;
  subsidyId: string;
  name: string;
  type: string;
  status: 'required' | 'preparing' | 'submitted' | 'approved';
  uploadedAt?: Date;
  url?: string;
}

export interface SubsidyTimeline {
  subsidyId: string;
  event: string;
  date: Date;
  status: 'planned' | 'completed' | 'delayed';
  description?: string;
}

export interface FundingSimulation {
  totalRequiredFunding: number;
  subsidies: SubsidyApplication[];
  loans: LoanApplication[];
  timeline: FundingTimeline[];
  cashflowProjection: CashflowProjection[];
}

export interface SubsidyApplication {
  subsidy: Subsidy;
  probability: number;
  expectedAmount: number;
  expectedDate: Date;
}

export interface LoanApplication {
  lender: string;
  amount: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  status: string;
}

export interface FundingTimeline {
  date: Date;
  type: 'application' | 'approval' | 'funding' | 'repayment';
  amount: number;
  description: string;
}

export interface CashflowProjection {
  date: Date;
  inflow: number;
  outflow: number;
  balance: number;
  fundingImpact: number;
}