import { Subsidy, SubsidyDocument, FundingSimulation } from '../models/subsidy';
import { logger } from '../utils/logger';

export class SubsidyService {
  private subsidies: Subsidy[] = [
    {
      id: 'jfc-001',
      name: '日本政策金融公庫 新規開業資金',
      type: 'loan',
      provider: '日本政策金融公庫',
      maxAmount: 72000000,
      applicationDeadline: new Date('2025-12-31'),
      status: 'preparing',
      documents: [],
      timeline: [],
      requirements: [
        '創業計画書',
        '事業計画書（3年分）',
        '履歴事項全部証明書',
        '印鑑証明書',
        '直近3ヶ月の試算表'
      ]
    },
    {
      id: 'it-005',
      name: 'IT導入補助金2025（通常枠）',
      type: 'subsidy',
      provider: '経済産業省',
      maxAmount: 4500000,
      applicationDeadline: new Date('2025-09-22'),
      status: 'preparing',
      documents: [],
      timeline: [],
      requirements: [
        'gBizIDプライム',
        'SECURITY ACTION宣言',
        'みらデジ経営チェック',
        '労働生産性向上計画',
        '賃上げ計画'
      ]
    },
    {
      id: 'tokyo-dx-002',
      name: '東京都DX推進助成金',
      type: 'grant',
      provider: '東京都中小企業振興公社',
      maxAmount: 30000000,
      applicationDeadline: new Date('2025-11-30'),
      status: 'preparing',
      documents: [],
      timeline: [],
      requirements: [
        'DXアドバイザー派遣申込（3ヶ月前）',
        'DX推進計画書',
        '賃金引上げ計画',
        '2社以上の見積書（100万円以上）'
      ]
    },
    {
      id: 'small-003',
      name: '小規模事業者持続化補助金（創業枠）',
      type: 'subsidy',
      provider: '日本商工会議所',
      maxAmount: 2000000,
      applicationDeadline: new Date('2025-11-28'),
      status: 'preparing',
      documents: [],
      timeline: [],
      requirements: [
        '経営計画書',
        '補助事業計画書',
        '創業3年未満の証明',
        '商工会議所の確認書'
      ]
    }
  ];

  async getAllSubsidies(): Promise<Subsidy[]> {
    return this.subsidies;
  }

  async getSubsidyById(id: string): Promise<Subsidy | undefined> {
    return this.subsidies.find(s => s.id === id);
  }

  async updateSubsidyStatus(id: string, status: Subsidy['status']): Promise<Subsidy> {
    const subsidy = this.subsidies.find(s => s.id === id);
    if (!subsidy) {
      throw new Error('Subsidy not found');
    }
    
    subsidy.status = status;
    subsidy.timeline.push({
      subsidyId: id,
      event: `Status changed to ${status}`,
      date: new Date(),
      status: 'completed'
    });
    
    logger.info(`Subsidy ${id} status updated to ${status}`);
    return subsidy;
  }

  async uploadDocument(subsidyId: string, document: Omit<SubsidyDocument, 'id' | 'subsidyId'>): Promise<SubsidyDocument> {
    const subsidy = this.subsidies.find(s => s.id === subsidyId);
    if (!subsidy) {
      throw new Error('Subsidy not found');
    }
    
    const newDocument: SubsidyDocument = {
      id: `doc-${Date.now()}`,
      subsidyId,
      ...document,
      uploadedAt: new Date()
    };
    
    subsidy.documents.push(newDocument);
    logger.info(`Document ${newDocument.name} uploaded for subsidy ${subsidyId}`);
    
    return newDocument;
  }

  async generateFundingSimulation(requiredAmount: number): Promise<FundingSimulation> {
    const simulation: FundingSimulation = {
      totalRequiredFunding: requiredAmount,
      subsidies: [],
      loans: [],
      timeline: [],
      cashflowProjection: []
    };

    // IT導入補助金の申請シミュレーション
    const itSubsidy = this.subsidies.find(s => s.id === 'it-005');
    if (itSubsidy) {
      simulation.subsidies.push({
        subsidy: itSubsidy,
        probability: 0.6,
        expectedAmount: 3000000,
        expectedDate: new Date('2025-12-01')
      });
    }

    // 日本政策金融公庫融資のシミュレーション
    simulation.loans.push({
      lender: '日本政策金融公庫',
      amount: 5000000,
      interestRate: 2.5,
      term: 60,
      monthlyPayment: 88611,
      status: 'preparing'
    });

    // タイムライン生成
    simulation.timeline.push({
      date: new Date('2025-08-15'),
      type: 'application',
      amount: 5000000,
      description: '日本政策金融公庫融資申請'
    });

    simulation.timeline.push({
      date: new Date('2025-09-01'),
      type: 'funding',
      amount: 5000000,
      description: '日本政策金融公庫融資実行'
    });

    // キャッシュフロー予測
    let balance = 12000000;
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      
      const inflow = i === 1 ? 5000000 : (i === 4 ? 3000000 : 0);
      const outflow = 88611;
      balance = balance + inflow - outflow;
      
      simulation.cashflowProjection.push({
        date,
        inflow,
        outflow,
        balance,
        fundingImpact: inflow
      });
    }

    return simulation;
  }

  async getApplicationChecklist(subsidyId: string): Promise<{ item: string; completed: boolean }[]> {
    const subsidy = this.subsidies.find(s => s.id === subsidyId);
    if (!subsidy) {
      throw new Error('Subsidy not found');
    }

    return subsidy.requirements.map(req => ({
      item: req,
      completed: subsidy.documents.some(doc => 
        doc.name.toLowerCase().includes(req.toLowerCase()) && 
        doc.status === 'approved'
      )
    }));
  }
}