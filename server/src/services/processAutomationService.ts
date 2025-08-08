import { BusinessProcess, AutomationOpportunity, WorkflowTemplate } from '../models/process';
import { logger } from '../utils/logger';

export class ProcessAutomationService {
  private processes: BusinessProcess[] = [
    {
      id: 'proc-001',
      name: '売掛金回収プロセス',
      type: 'receivables',
      status: 'semi-automated',
      automationLevel: 40,
      steps: [
        {
          id: 'step-001',
          processId: 'proc-001',
          name: '請求書発行',
          description: '月末締めで請求書を自動生成',
          isAutomated: true,
          executionTime: 5,
          dependencies: [],
          actions: []
        },
        {
          id: 'step-002',
          processId: 'proc-001',
          name: '入金確認',
          description: '銀行APIで自動照合',
          isAutomated: true,
          executionTime: 2,
          dependencies: ['step-001'],
          actions: []
        },
        {
          id: 'step-003',
          processId: 'proc-001',
          name: '督促メール送信',
          description: '期日超過で自動送信',
          isAutomated: false,
          executionTime: 15,
          dependencies: ['step-002'],
          actions: []
        }
      ],
      metrics: {
        averageExecutionTime: 22,
        errorRate: 5,
        completionRate: 95,
        costSavings: 150000,
        lastExecuted: new Date()
      },
      alerts: []
    },
    {
      id: 'proc-002',
      name: '支払承認ワークフロー',
      type: 'payables',
      status: 'manual',
      automationLevel: 20,
      steps: [
        {
          id: 'step-004',
          processId: 'proc-002',
          name: '支払申請作成',
          description: '請求書から支払申請を作成',
          isAutomated: false,
          executionTime: 30,
          dependencies: [],
          actions: []
        },
        {
          id: 'step-005',
          processId: 'proc-002',
          name: '承認プロセス',
          description: '金額に応じた承認ルート',
          isAutomated: false,
          executionTime: 480,
          dependencies: ['step-004'],
          actions: []
        },
        {
          id: 'step-006',
          processId: 'proc-002',
          name: '振込実行',
          description: '承認済み支払の実行',
          isAutomated: false,
          executionTime: 20,
          dependencies: ['step-005'],
          actions: []
        }
      ],
      metrics: {
        averageExecutionTime: 530,
        errorRate: 2,
        completionRate: 98,
        costSavings: 0,
        lastExecuted: new Date()
      },
      alerts: []
    }
  ];

  private workflowTemplates: WorkflowTemplate[] = [
    {
      id: 'tmpl-001',
      name: '自動督促ワークフロー',
      category: 'receivables',
      description: '支払期日超過時の自動督促プロセス',
      steps: [
        {
          id: 'wf-step-001',
          name: '期日チェック',
          type: 'condition',
          config: {
            condition: 'daysOverdue > 0'
          },
          nextSteps: [{ stepId: 'wf-step-002' }]
        },
        {
          id: 'wf-step-002',
          name: '督促メール送信',
          type: 'action',
          config: {
            action: 'sendReminderEmail'
          },
          nextSteps: [{ stepId: 'wf-step-003' }]
        },
        {
          id: 'wf-step-003',
          name: '営業担当通知',
          type: 'notification',
          config: {
            recipients: ['sales-team']
          },
          nextSteps: []
        }
      ],
      triggers: [
        {
          type: 'schedule',
          config: {
            schedule: '0 9 * * *' // 毎日9時
          }
        }
      ],
      estimatedSavings: 200000
    },
    {
      id: 'tmpl-002',
      name: '支払承認自動化',
      category: 'payables',
      description: '金額別の自動承認ルーティング',
      steps: [
        {
          id: 'wf-step-004',
          name: '金額判定',
          type: 'condition',
          config: {
            condition: 'amount <= 100000'
          },
          nextSteps: [
            { condition: 'true', stepId: 'wf-step-005' },
            { condition: 'false', stepId: 'wf-step-006' }
          ]
        },
        {
          id: 'wf-step-005',
          name: '自動承認',
          type: 'action',
          config: {
            action: 'autoApprove'
          },
          nextSteps: [{ stepId: 'wf-step-007' }]
        },
        {
          id: 'wf-step-006',
          name: '承認依頼',
          type: 'approval',
          config: {
            approvers: ['cfo', 'ceo']
          },
          nextSteps: [{ stepId: 'wf-step-007' }]
        },
        {
          id: 'wf-step-007',
          name: '振込予約',
          type: 'action',
          config: {
            action: 'schedulePayment'
          },
          nextSteps: []
        }
      ],
      triggers: [
        {
          type: 'event',
          config: {
            event: 'paymentRequestCreated'
          }
        }
      ],
      estimatedSavings: 300000
    }
  ];

  async getAllProcesses(): Promise<BusinessProcess[]> {
    return this.processes;
  }

  async getProcessById(id: string): Promise<BusinessProcess | undefined> {
    return this.processes.find(p => p.id === id);
  }

  async getAutomationOpportunities(): Promise<AutomationOpportunity[]> {
    const opportunities: AutomationOpportunity[] = [];

    for (const process of this.processes) {
      if (process.automationLevel < 70) {
        const manualSteps = process.steps.filter(s => !s.isAutomated);
        const totalTime = manualSteps.reduce((acc, step) => acc + step.executionTime, 0);
        const timeSavings = totalTime * 0.8; // 80%削減想定
        const costSavings = timeSavings * 5000 / 60; // 時給5000円想定

        opportunities.push({
          processId: process.id,
          processName: process.name,
          currentState: process.status === 'manual' ? 'manual' : 'semi-automated',
          potentialSavings: {
            timeHours: timeSavings / 60,
            costYen: costSavings * 20 * 12 // 月20回×12ヶ月
          },
          requiredInvestment: costSavings * 6, // 6ヶ月回収想定
          roi: (costSavings * 20 * 12) / (costSavings * 6) * 100,
          implementationDifficulty: totalTime > 100 ? 'high' : totalTime > 50 ? 'medium' : 'low',
          recommendations: this.generateRecommendations(process)
        });
      }
    }

    return opportunities.sort((a, b) => b.roi - a.roi);
  }

  private generateRecommendations(process: BusinessProcess): string[] {
    const recommendations: string[] = [];

    if (process.type === 'receivables') {
      recommendations.push('AIによる与信判定の自動化');
      recommendations.push('督促メールのテンプレート自動選択');
      recommendations.push('入金予測モデルの導入');
    }

    if (process.type === 'payables') {
      recommendations.push('OCRによる請求書自動読取');
      recommendations.push('承認ルートの動的最適化');
      recommendations.push('支払スケジュールの自動最適化');
    }

    if (process.automationLevel < 50) {
      recommendations.push('RPAツールの導入検討');
      recommendations.push('APIを活用した外部システム連携');
    }

    return recommendations;
  }

  async calculateAutomationROI(): Promise<{
    currentAutomationLevel: number;
    targetAutomationLevel: number;
    currentCost: number;
    projectedCost: number;
    annualSavings: number;
    investmentRequired: number;
    paybackPeriod: number;
  }> {
    const totalProcesses = this.processes.length;
    const currentAutomation = this.processes.reduce((acc, p) => acc + p.automationLevel, 0) / totalProcesses;
    
    const manualTime = this.processes.reduce((acc, p) => {
      const manualSteps = p.steps.filter(s => !s.isAutomated);
      return acc + manualSteps.reduce((sum, step) => sum + step.executionTime, 0);
    }, 0);

    const currentCost = manualTime * 5000 / 60 * 20 * 12; // 年間コスト
    const targetAutomation = 70;
    const projectedCost = currentCost * (1 - (targetAutomation - currentAutomation) / 100);
    const annualSavings = currentCost - projectedCost;
    const investmentRequired = annualSavings * 0.5; // 投資額は年間削減額の50%
    const paybackPeriod = investmentRequired / annualSavings * 12; // 月数

    return {
      currentAutomationLevel: currentAutomation,
      targetAutomationLevel: targetAutomation,
      currentCost,
      projectedCost,
      annualSavings,
      investmentRequired,
      paybackPeriod
    };
  }

  async getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
    return this.workflowTemplates;
  }

  async applyWorkflowTemplate(processId: string, templateId: string): Promise<BusinessProcess> {
    const process = this.processes.find(p => p.id === processId);
    const template = this.workflowTemplates.find(t => t.id === templateId);

    if (!process || !template) {
      throw new Error('Process or template not found');
    }

    // テンプレートを適用してプロセスを更新
    process.automationLevel = Math.min(process.automationLevel + 30, 100);
    process.status = process.automationLevel >= 70 ? 'automated' : 'semi-automated';
    
    logger.info(`Applied workflow template ${templateId} to process ${processId}`);
    
    return process;
  }
}