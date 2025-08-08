import { Risk, RiskMatrix, RiskAlert, GovernancePolicy, ComplianceCheckpoint } from '../models/risk';
import { logger } from '../utils/logger';

export class RiskManagementService {
  private risks: Risk[] = [
    {
      id: 'risk-001',
      category: 'financial',
      name: '資金ショート',
      description: '運転資金の枯渇による事業継続リスク',
      impact: 3,
      probability: 3,
      riskScore: 9,
      status: 'assessed',
      owner: 'CFO',
      mitigationActions: [
        {
          id: 'mit-001',
          riskId: 'risk-001',
          action: '日本政策金融公庫融資の早期実行',
          dueDate: new Date('2025-09-01'),
          status: 'in_progress',
          owner: 'CEO',
          cost: 0,
          effectiveness: 'high'
        },
        {
          id: 'mit-002',
          riskId: 'risk-001',
          action: '売掛金の早期回収交渉',
          dueDate: new Date('2025-08-20'),
          status: 'planned',
          owner: '営業担当',
          cost: 0,
          effectiveness: 'medium'
        }
      ],
      kri: [
        {
          id: 'kri-001',
          riskId: 'risk-001',
          metric: '現金残高（月次必要資金比）',
          threshold: 50,
          currentValue: 45,
          trend: 'deteriorating',
          lastUpdated: new Date()
        }
      ],
      lastAssessment: new Date(),
      nextReview: new Date('2025-08-15')
    },
    {
      id: 'risk-002',
      category: 'financial',
      name: '補助金不採択',
      description: 'IT導入補助金やDX推進助成金の不採択',
      impact: 3,
      probability: 2,
      riskScore: 6,
      status: 'assessed',
      owner: 'プロジェクトアドバイザー',
      mitigationActions: [
        {
          id: 'mit-003',
          riskId: 'risk-002',
          action: '申請書の精緻化と専門家レビュー',
          dueDate: new Date('2025-09-10'),
          status: 'planned',
          owner: 'プロジェクトアドバイザー',
          cost: 100000,
          effectiveness: 'high'
        }
      ],
      kri: [
        {
          id: 'kri-002',
          riskId: 'risk-002',
          metric: '補助金採択率（過去実績）',
          threshold: 50,
          currentValue: 60,
          trend: 'stable',
          lastUpdated: new Date()
        }
      ],
      lastAssessment: new Date(),
      nextReview: new Date('2025-09-01')
    },
    {
      id: 'risk-003',
      category: 'operational',
      name: 'API誤操作による振込ミス',
      description: '銀行APIの誤操作による誤送金リスク',
      impact: 3,
      probability: 2,
      riskScore: 6,
      status: 'mitigated',
      owner: 'CTO',
      mitigationActions: [
        {
          id: 'mit-004',
          riskId: 'risk-003',
          action: '多重承認制の実装',
          dueDate: new Date('2025-09-30'),
          status: 'planned',
          owner: 'CTO',
          cost: 200000,
          effectiveness: 'high'
        }
      ],
      kri: [
        {
          id: 'kri-003',
          riskId: 'risk-003',
          metric: '月間手動振込件数',
          threshold: 20,
          currentValue: 15,
          trend: 'improving',
          lastUpdated: new Date()
        }
      ],
      lastAssessment: new Date(),
      nextReview: new Date('2025-10-01')
    }
  ];

  private governancePolicies: GovernancePolicy[] = [
    {
      id: 'pol-001',
      name: '資金管理ポリシー',
      category: 'financial',
      description: '現金残高管理と支払承認に関する規定',
      effectiveDate: new Date('2025-08-01'),
      lastReviewed: new Date('2025-08-01'),
      nextReview: new Date('2026-08-01'),
      owner: 'CFO',
      status: 'approved',
      documents: []
    },
    {
      id: 'pol-002',
      name: 'API利用セキュリティポリシー',
      category: 'operational',
      description: '銀行APIの安全な利用に関する規定',
      effectiveDate: new Date('2025-09-01'),
      lastReviewed: new Date('2025-08-01'),
      nextReview: new Date('2026-02-01'),
      owner: 'CTO',
      status: 'draft',
      documents: []
    }
  ];

  private complianceCheckpoints: ComplianceCheckpoint[] = [
    {
      id: 'comp-001',
      name: '電子帳簿保存法準拠確認',
      category: 'regulatory',
      frequency: 'monthly',
      lastChecked: new Date('2025-07-31'),
      nextCheck: new Date('2025-08-31'),
      status: 'compliant',
      evidence: ['audit-log-2025-07.pdf'],
      responsibleParty: 'CFO'
    },
    {
      id: 'comp-002',
      name: '補助金実績報告',
      category: 'grant',
      frequency: 'quarterly',
      nextCheck: new Date('2025-12-31'),
      status: 'pending',
      responsibleParty: 'プロジェクトアドバイザー'
    }
  ];

  async getAllRisks(): Promise<Risk[]> {
    return this.risks;
  }

  async getRiskById(id: string): Promise<Risk | undefined> {
    return this.risks.find(r => r.id === id);
  }

  async getRiskMatrix(): Promise<RiskMatrix> {
    const matrix: RiskMatrix = {
      highImpactHighProb: [],
      highImpactMedProb: [],
      highImpactLowProb: [],
      medImpactHighProb: [],
      medImpactMedProb: [],
      medImpactLowProb: [],
      lowImpactHighProb: [],
      lowImpactMedProb: [],
      lowImpactLowProb: []
    };

    this.risks.forEach(risk => {
      const key = `${risk.impact === 3 ? 'high' : risk.impact === 2 ? 'med' : 'low'}Impact${risk.probability === 3 ? 'High' : risk.probability === 2 ? 'Med' : 'Low'}Prob` as keyof RiskMatrix;
      matrix[key].push(risk);
    });

    return matrix;
  }

  async getActiveAlerts(): Promise<RiskAlert[]> {
    const alerts: RiskAlert[] = [];

    // KRI閾値違反チェック
    this.risks.forEach(risk => {
      risk.kri.forEach(kri => {
        if (kri.currentValue < kri.threshold) {
          alerts.push({
            id: `alert-${Date.now()}-${kri.id}`,
            riskId: risk.id,
            type: 'threshold_breach',
            message: `${risk.name}: ${kri.metric}が閾値を下回っています（現在値: ${kri.currentValue}%, 閾値: ${kri.threshold}%）`,
            severity: risk.riskScore >= 7 ? 'critical' : risk.riskScore >= 4 ? 'high' : 'medium',
            createdAt: new Date()
          });
        }
      });

      // レビュー期限チェック
      if (risk.nextReview < new Date()) {
        alerts.push({
          id: `alert-${Date.now()}-review-${risk.id}`,
          riskId: risk.id,
          type: 'review_due',
          message: `${risk.name}のリスクレビューが期限を過ぎています`,
          severity: 'medium',
          createdAt: new Date()
        });
      }
    });

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  }

  async updateRiskAssessment(id: string, impact: 1 | 2 | 3, probability: 1 | 2 | 3): Promise<Risk> {
    const risk = this.risks.find(r => r.id === id);
    if (!risk) {
      throw new Error('Risk not found');
    }

    risk.impact = impact;
    risk.probability = probability;
    risk.riskScore = impact * probability;
    risk.lastAssessment = new Date();
    risk.nextReview = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30日後

    logger.info(`Risk ${id} assessment updated: impact=${impact}, probability=${probability}, score=${risk.riskScore}`);
    
    return risk;
  }

  async getGovernancePolicies(): Promise<GovernancePolicy[]> {
    return this.governancePolicies;
  }

  async getComplianceStatus(): Promise<{
    totalCheckpoints: number;
    compliant: number;
    nonCompliant: number;
    pending: number;
    complianceRate: number;
    upcomingChecks: ComplianceCheckpoint[];
  }> {
    const compliant = this.complianceCheckpoints.filter(c => c.status === 'compliant').length;
    const nonCompliant = this.complianceCheckpoints.filter(c => c.status === 'non_compliant').length;
    const pending = this.complianceCheckpoints.filter(c => c.status === 'pending').length;
    
    const upcomingChecks = this.complianceCheckpoints
      .filter(c => c.nextCheck <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
      .sort((a, b) => a.nextCheck.getTime() - b.nextCheck.getTime());

    return {
      totalCheckpoints: this.complianceCheckpoints.length,
      compliant,
      nonCompliant,
      pending,
      complianceRate: (compliant / this.complianceCheckpoints.length) * 100,
      upcomingChecks
    };
  }

  async generateRiskReport(): Promise<{
    summary: {
      totalRisks: number;
      criticalRisks: number;
      highRisks: number;
      mediumRisks: number;
      lowRisks: number;
    };
    topRisks: Risk[];
    mitigationProgress: {
      total: number;
      completed: number;
      inProgress: number;
      planned: number;
    };
    financialExposure: number;
  }> {
    const criticalRisks = this.risks.filter(r => r.riskScore >= 7);
    const highRisks = this.risks.filter(r => r.riskScore >= 4 && r.riskScore < 7);
    const mediumRisks = this.risks.filter(r => r.riskScore >= 2 && r.riskScore < 4);
    const lowRisks = this.risks.filter(r => r.riskScore < 2);

    const allMitigations = this.risks.flatMap(r => r.mitigationActions);
    const completedMitigations = allMitigations.filter(m => m.status === 'completed');
    const inProgressMitigations = allMitigations.filter(m => m.status === 'in_progress');
    const plannedMitigations = allMitigations.filter(m => m.status === 'planned');

    const financialExposure = this.risks
      .filter(r => r.category === 'financial')
      .reduce((sum, r) => sum + (r.impact * 10000000), 0); // 影響度×1000万円

    return {
      summary: {
        totalRisks: this.risks.length,
        criticalRisks: criticalRisks.length,
        highRisks: highRisks.length,
        mediumRisks: mediumRisks.length,
        lowRisks: lowRisks.length
      },
      topRisks: [...criticalRisks, ...highRisks].slice(0, 5),
      mitigationProgress: {
        total: allMitigations.length,
        completed: completedMitigations.length,
        inProgress: inProgressMitigations.length,
        planned: plannedMitigations.length
      },
      financialExposure
    };
  }
}