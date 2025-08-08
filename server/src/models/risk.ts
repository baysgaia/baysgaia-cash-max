export interface Risk {
  id: string;
  category: 'financial' | 'technical' | 'operational' | 'compliance' | 'strategic';
  name: string;
  description: string;
  impact: 1 | 2 | 3; // Low, Medium, High
  probability: 1 | 2 | 3; // Low, Medium, High
  riskScore: number; // impact × probability
  status: 'identified' | 'assessed' | 'mitigated' | 'accepted' | 'closed';
  owner: string;
  mitigationActions: MitigationAction[];
  kri: KeyRiskIndicator[];
  lastAssessment: Date;
  nextReview: Date;
}

export interface MitigationAction {
  id: string;
  riskId: string;
  action: string;
  dueDate: Date;
  status: 'planned' | 'in_progress' | 'completed';
  owner: string;
  cost: number;
  effectiveness: 'low' | 'medium' | 'high';
}

export interface KeyRiskIndicator {
  id: string;
  riskId: string;
  metric: string;
  threshold: number;
  currentValue: number;
  trend: 'improving' | 'stable' | 'deteriorating';
  lastUpdated: Date;
}

export interface RiskAlert {
  id: string;
  riskId: string;
  type: 'threshold_breach' | 'review_due' | 'new_risk' | 'escalation';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
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

export interface GovernancePolicy {
  id: string;
  name: string;
  category: 'financial' | 'data' | 'operational' | 'compliance';
  description: string;
  effectiveDate: Date;
  lastReviewed: Date;
  nextReview: Date;
  owner: string;
  status: 'draft' | 'approved' | 'under_review';
  documents: PolicyDocument[];
}

export interface PolicyDocument {
  id: string;
  policyId: string;
  name: string;
  version: string;
  url: string;
  uploadedAt: Date;
}

export interface ComplianceCheckpoint {
  id: string;
  name: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  lastChecked?: Date;
  nextCheck: Date;
  status: 'compliant' | 'non_compliant' | 'pending';
  evidence?: string[];
  responsibleParty: string;
}