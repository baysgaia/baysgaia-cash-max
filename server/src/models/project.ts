export interface Project {
  id: string;
  name: string;
  phase: Phase;
  startDate: Date;
  endDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  objectives: Objective[];
  milestones: Milestone[];
  tasks: Task[];
  resources: Resource[];
  budget: Budget;
  progress: number;
  lastUpdated: Date;
}

export interface Phase {
  id: string;
  number: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  duration: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completionCriteria: string[];
}

export interface Objective {
  id: string;
  name: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  status: 'on_track' | 'at_risk' | 'achieved' | 'missed';
}

export interface Milestone {
  id: string;
  phaseId: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'delayed';
  deliverables: string[];
  dependencies: string[];
}

export interface Task {
  id: string;
  milestoneId: string;
  name: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  estimatedHours: number;
  actualHours?: number;
  startDate: Date;
  dueDate: Date;
  completedAt?: Date;
  blockers?: string[];
}

export interface Resource {
  id: string;
  name: string;
  type: 'human' | 'financial' | 'technical' | 'external';
  availability: number; // percentage
  allocation: { taskId: string; hours: number }[];
  cost: number;
}

export interface Budget {
  total: number;
  allocated: number;
  spent: number;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  name: string;
  budget: number;
  spent: number;
  items: BudgetItem[];
}

export interface BudgetItem {
  name: string;
  amount: number;
  date: Date;
  status: 'planned' | 'committed' | 'paid';
}

export interface ProjectReport {
  projectId: string;
  reportDate: Date;
  overallHealth: 'green' | 'yellow' | 'red';
  progressSummary: {
    tasksCompleted: number;
    tasksTotal: number;
    milestonesCompleted: number;
    milestonesTotal: number;
  };
  budgetStatus: {
    spent: number;
    remaining: number;
    burnRate: number;
  };
  risks: string[];
  issues: string[];
  nextSteps: string[];
}