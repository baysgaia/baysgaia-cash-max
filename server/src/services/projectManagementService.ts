import { Project, Phase, Objective, Milestone, ProjectReport } from '../models/project';
import { logger } from '../utils/logger';

export class ProjectManagementService {
  private project: Project = {
    id: 'proj-001',
    name: '現金残高最大化プロジェクト',
    phase: {
      id: 'phase-2',
      number: 2,
      name: 'システム導入',
      description: 'デジタルツール活用と運転資本の改善開始',
      duration: 'Week 4-7',
      status: 'in_progress',
      completionCriteria: [
        'デジタルツールの選定と導入完了',
        'パイロットでDSO 15%以上短縮確認',
        'IT導入補助金の申請完了',
        '全社展開の準備完了'
      ]
    },
    startDate: new Date('2025-08-01'),
    endDate: new Date('2025-11-30'),
    status: 'in_progress',
    objectives: [
      {
        id: 'obj-001',
        name: 'KR1: 月末現金残高',
        description: '月末現金残高を20%増加',
        targetValue: 20,
        currentValue: 5.2,
        unit: '%',
        deadline: new Date('2025-11-01'),
        status: 'at_risk'
      },
      {
        id: 'obj-002',
        name: 'KR2: CCC短縮',
        description: 'キャッシュ転換日数を25%短縮',
        targetValue: 25,
        currentValue: 18,
        unit: '%',
        deadline: new Date('2025-12-01'),
        status: 'on_track'
      },
      {
        id: 'obj-003',
        name: 'KR3: DSO短縮',
        description: '売掛金回収日数を30%短縮',
        targetValue: 30,
        currentValue: 22,
        unit: '%',
        deadline: new Date('2025-10-01'),
        status: 'on_track'
      },
      {
        id: 'obj-004',
        name: 'KR4: 資金予測精度',
        description: '資金予測精度95%以上',
        targetValue: 95,
        currentValue: 92.5,
        unit: '%',
        deadline: new Date('2025-10-01'),
        status: 'on_track'
      },
      {
        id: 'obj-005',
        name: 'KR5: プロセス自動化',
        description: '資金関連プロセス自動化70%',
        targetValue: 70,
        currentValue: 35,
        unit: '%',
        deadline: new Date('2025-12-01'),
        status: 'at_risk'
      }
    ],
    milestones: [
      {
        id: 'ms-001',
        phaseId: 'phase-1',
        name: 'M1: 現状分析完了・緊急資金確保',
        description: 'Phase 1完了',
        dueDate: new Date('2025-08-22'),
        status: 'completed',
        deliverables: ['KPIベースライン', '融資実行'],
        dependencies: []
      },
      {
        id: 'ms-002',
        phaseId: 'phase-2',
        name: 'M2: システム導入・パイロット成功',
        description: 'Phase 2完了',
        dueDate: new Date('2025-09-19'),
        status: 'pending',
        deliverables: ['ツール導入完了', 'DSO 15%短縮確認'],
        dependencies: ['ms-001']
      },
      {
        id: 'ms-003',
        phaseId: 'phase-3',
        name: 'M3: プロセス変革・自動化達成',
        description: 'Phase 3完了',
        dueDate: new Date('2025-10-17'),
        status: 'pending',
        deliverables: ['自動化率70%達成', 'AI予測精度95%'],
        dependencies: ['ms-002']
      },
      {
        id: 'ms-004',
        phaseId: 'phase-4',
        name: 'M4: プロジェクト完了・目標達成',
        description: 'Phase 4完了',
        dueDate: new Date('2025-11-30'),
        status: 'pending',
        deliverables: ['全KR達成', 'ROI 5倍以上'],
        dependencies: ['ms-003']
      }
    ],
    tasks: [],
    resources: [],
    budget: {
      total: 10000000,
      allocated: 8000000,
      spent: 2500000,
      categories: [
        {
          name: 'システム導入',
          budget: 4500000,
          spent: 1500000,
          items: []
        },
        {
          name: '人件費',
          budget: 3000000,
          spent: 800000,
          items: []
        },
        {
          name: '外部サービス',
          budget: 2000000,
          spent: 200000,
          items: []
        },
        {
          name: '予備費',
          budget: 500000,
          spent: 0,
          items: []
        }
      ]
    },
    progress: 35,
    lastUpdated: new Date()
  };

  private phases: Phase[] = [
    {
      id: 'phase-1',
      number: 1,
      name: '基盤構築',
      description: '現状把握と資金繰りの安定化',
      duration: 'Week 0-3',
      status: 'completed',
      completionCriteria: [
        '全KPIのベースライン測定完了',
        'GMOあおぞらネット銀行API接続の技術検証完了',
        'sunabar環境での主要機能テスト成功',
        '緊急資金調達の目途確立',
        'プロジェクト体制の確立'
      ]
    },
    {
      id: 'phase-2',
      number: 2,
      name: 'システム導入',
      description: 'デジタルツール活用と運転資本の改善開始',
      duration: 'Week 4-7',
      status: 'in_progress',
      completionCriteria: [
        'デジタルツールの選定と導入完了',
        'パイロットでDSO 15%以上短縮確認',
        'IT導入補助金の申請完了',
        '全社展開の準備完了'
      ]
    },
    {
      id: 'phase-3',
      number: 3,
      name: 'プロセス変革',
      description: '業務フロー最適化と自動化定着',
      duration: 'Week 8-11',
      status: 'not_started',
      completionCriteria: [
        '全社での新プロセス稼働',
        '自動化率70%達成',
        'AI予測精度95%以上達成',
        '法令遵守要件の充足確認'
      ]
    },
    {
      id: 'phase-4',
      number: 4,
      name: '最適化＆拡張',
      description: 'モニタリング強化と継続的改善',
      duration: 'Week 12-16',
      status: 'not_started',
      completionCriteria: [
        '全KRの達成または明確な改善',
        'ROI 5倍以上の実現',
        '継続改善体制の確立',
        '次期展開計画の承認'
      ]
    }
  ];

  async getProject(): Promise<Project> {
    return this.project;
  }

  async getAllPhases(): Promise<Phase[]> {
    return this.phases;
  }

  async getCurrentPhase(): Promise<Phase> {
    return this.project.phase;
  }

  async updateObjectiveProgress(objectiveId: string, currentValue: number): Promise<Objective> {
    const objective = this.project.objectives.find(o => o.id === objectiveId);
    if (!objective) {
      throw new Error('Objective not found');
    }

    objective.currentValue = currentValue;
    
    // ステータス更新
    const achievementRate = (currentValue / objective.targetValue) * 100;
    if (achievementRate >= 100) {
      objective.status = 'achieved';
    } else if (achievementRate >= 80) {
      objective.status = 'on_track';
    } else if (achievementRate >= 60) {
      objective.status = 'at_risk';
    } else {
      objective.status = 'missed';
    }

    this.updateProjectProgress();
    logger.info(`Objective ${objectiveId} progress updated to ${currentValue}${objective.unit}`);
    
    return objective;
  }

  private updateProjectProgress(): void {
    const totalObjectives = this.project.objectives.length;
    const achievedObjectives = this.project.objectives.filter(o => o.status === 'achieved').length;
    const onTrackObjectives = this.project.objectives.filter(o => o.status === 'on_track').length;
    
    this.project.progress = Math.round(
      ((achievedObjectives * 100) + (onTrackObjectives * 50)) / totalObjectives
    );
    this.project.lastUpdated = new Date();
  }

  async getProjectTimeline(): Promise<{
    phases: Phase[];
    currentPhase: number;
    milestones: Milestone[];
    upcomingMilestones: Milestone[];
    completedMilestones: Milestone[];
  }> {
    const upcomingMilestones = this.project.milestones
      .filter(m => m.status === 'pending')
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
    
    const completedMilestones = this.project.milestones
      .filter(m => m.status === 'completed')
      .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());

    return {
      phases: this.phases,
      currentPhase: this.project.phase.number,
      milestones: this.project.milestones,
      upcomingMilestones,
      completedMilestones
    };
  }

  async generateProjectReport(): Promise<ProjectReport> {
    const tasks = this.project.tasks || [];
    const tasksCompleted = tasks.filter(t => t.status === 'done').length;
    const milestonesCompleted = this.project.milestones.filter(m => m.status === 'completed').length;
    
    const budgetSpent = this.project.budget.spent;
    const budgetRemaining = this.project.budget.total - budgetSpent;
    const projectDuration = (this.project.endDate.getTime() - this.project.startDate.getTime()) / (1000 * 60 * 60 * 24);
    const daysPassed = (new Date().getTime() - this.project.startDate.getTime()) / (1000 * 60 * 60 * 24);
    const burnRate = budgetSpent / daysPassed;

    let overallHealth: 'green' | 'yellow' | 'red' = 'green';
    const risks: string[] = [];
    const issues: string[] = [];
    const nextSteps: string[] = [];

    // リスク評価
    const atRiskObjectives = this.project.objectives.filter(o => o.status === 'at_risk');
    if (atRiskObjectives.length > 0) {
      overallHealth = 'yellow';
      atRiskObjectives.forEach(obj => {
        risks.push(`${obj.name}が目標値に届かない可能性があります（現在: ${obj.currentValue}${obj.unit}、目標: ${obj.targetValue}${obj.unit}）`);
      });
    }

    // 予算オーバーラン評価
    if (burnRate * projectDuration > this.project.budget.total) {
      overallHealth = 'red';
      issues.push('現在の支出ペースでは予算超過の可能性があります');
    }

    // 次のステップ
    const upcomingMilestone = this.project.milestones
      .filter(m => m.status === 'pending')
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];
    
    if (upcomingMilestone) {
      nextSteps.push(`${upcomingMilestone.name}の達成に向けた活動`);
      upcomingMilestone.deliverables.forEach(d => {
        nextSteps.push(`- ${d}`);
      });
    }

    return {
      projectId: this.project.id,
      reportDate: new Date(),
      overallHealth,
      progressSummary: {
        tasksCompleted,
        tasksTotal: tasks.length,
        milestonesCompleted,
        milestonesTotal: this.project.milestones.length
      },
      budgetStatus: {
        spent: budgetSpent,
        remaining: budgetRemaining,
        burnRate
      },
      risks,
      issues,
      nextSteps
    };
  }

  async getGanttChartData(): Promise<{
    phases: { name: string; start: Date; end: Date; progress: number }[];
    milestones: { name: string; date: Date; phase: string }[];
  }> {
    const phases = this.phases.map(phase => {
      const phaseProgress = phase.status === 'completed' ? 100 : 
                          phase.status === 'in_progress' ? 50 : 0;
      
      return {
        name: phase.name,
        start: this.getPhaseStartDate(phase.number),
        end: this.getPhaseEndDate(phase.number),
        progress: phaseProgress
      };
    });

    const milestones = this.project.milestones.map(milestone => {
      const phase = this.phases.find(p => p.id === milestone.phaseId);
      return {
        name: milestone.name,
        date: milestone.dueDate,
        phase: phase?.name || ''
      };
    });

    return { phases, milestones };
  }

  private getPhaseStartDate(phaseNumber: number): Date {
    const weekOffsets = { 1: 0, 2: 4, 3: 8, 4: 12 };
    const startDate = new Date(this.project.startDate);
    startDate.setDate(startDate.getDate() + (weekOffsets[phaseNumber as keyof typeof weekOffsets] || 0) * 7);
    return startDate;
  }

  private getPhaseEndDate(phaseNumber: number): Date {
    const weekOffsets = { 1: 3, 2: 7, 3: 11, 4: 16 };
    const startDate = new Date(this.project.startDate);
    startDate.setDate(startDate.getDate() + (weekOffsets[phaseNumber as keyof typeof weekOffsets] || 0) * 7);
    return startDate;
  }
}