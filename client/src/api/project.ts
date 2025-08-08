import axios from 'axios';

const API_BASE = '/api';

export interface Project {
  id: string;
  name: string;
  phase: {
    number: number;
    name: string;
    description: string;
    duration: string;
    completionCriteria: string[];
  };
  progress: number;
  objectives: Array<{
    id: string;
    name: string;
    description: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline: string;
    status: string;
  }>;
  budget: {
    total: number;
    spent: number;
  };
}

export interface ProjectTimeline {
  phases: any[];
  currentPhase: number;
  upcomingMilestones: any[];
  completedMilestones: any[];
}

export interface ProjectReport {
  reportDate: string;
  overallHealth: string;
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

export async function fetchProject(): Promise<Project> {
  const response = await axios.get(`${API_BASE}/project`);
  return response.data.data;
}

export async function fetchProjectTimeline(): Promise<ProjectTimeline> {
  const response = await axios.get(`${API_BASE}/project/timeline`);
  return response.data.data;
}

export async function fetchProjectReport(): Promise<ProjectReport> {
  const response = await axios.get(`${API_BASE}/project/report`);
  return response.data.data;
}