export interface BusinessProcess {
  id: string;
  name: string;
  type: 'receivables' | 'payables' | 'inventory' | 'reporting';
  status: 'manual' | 'semi-automated' | 'automated';
  automationLevel: number; // 0-100%
  steps: ProcessStep[];
  metrics: ProcessMetrics;
  alerts: ProcessAlert[];
}

export interface ProcessStep {
  id: string;
  processId: string;
  name: string;
  description: string;
  isAutomated: boolean;
  executionTime: number; // minutes
  dependencies: string[];
  actions: ProcessAction[];
}

export interface ProcessAction {
  type: 'manual' | 'api' | 'email' | 'approval' | 'calculation';
  config: Record<string, any>;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface ProcessMetrics {
  averageExecutionTime: number;
  errorRate: number;
  completionRate: number;
  costSavings: number;
  lastExecuted?: Date;
}

export interface ProcessAlert {
  id: string;
  processId: string;
  type: 'delay' | 'error' | 'threshold' | 'approval_required';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: WorkflowStep[];
  triggers: WorkflowTrigger[];
  estimatedSavings: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'condition' | 'action' | 'approval' | 'notification';
  config: {
    condition?: string;
    action?: string;
    approvers?: string[];
    recipients?: string[];
  };
  nextSteps: { condition?: string; stepId: string }[];
}

export interface WorkflowTrigger {
  type: 'schedule' | 'event' | 'manual' | 'threshold';
  config: {
    schedule?: string;
    event?: string;
    threshold?: { metric: string; operator: string; value: number };
  };
}

export interface AutomationOpportunity {
  processId: string;
  processName: string;
  currentState: 'manual' | 'semi-automated';
  potentialSavings: {
    timeHours: number;
    costYen: number;
  };
  requiredInvestment: number;
  roi: number;
  implementationDifficulty: 'low' | 'medium' | 'high';
  recommendations: string[];
}