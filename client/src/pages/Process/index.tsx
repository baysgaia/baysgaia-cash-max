import { useQuery } from '@tanstack/react-query';
import { fetchProcesses, fetchAutomationOpportunities, fetchAutomationROI } from '../../api/process';

export default function ProcessAutomation() {
  const { data: processes, isLoading } = useQuery({
    queryKey: ['processes'],
    queryFn: fetchProcesses,
  });

  const { data: opportunities } = useQuery({
    queryKey: ['automationOpportunities'],
    queryFn: fetchAutomationOpportunities,
  });

  const { data: roi } = useQuery({
    queryKey: ['automationROI'],
    queryFn: fetchAutomationROI,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">データを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">プロセス自動化</h2>
        <p className="text-gray-600">業務プロセスの最適化と自動化推進</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="metric-card border-primary-500">
          <h3 className="text-sm font-medium text-gray-600">現在の自動化率</h3>
          <p className="text-2xl font-bold text-gray-900">
            {roi?.currentAutomationLevel.toFixed(0)}%
          </p>
          <p className="text-xs text-gray-500">目標: {roi?.targetAutomationLevel}%</p>
        </div>
        <div className="metric-card border-success-500">
          <h3 className="text-sm font-medium text-gray-600">年間削減可能額</h3>
          <p className="text-2xl font-bold text-gray-900">
            ¥{roi?.annualSavings.toLocaleString()}
          </p>
        </div>
        <div className="metric-card border-warning-500">
          <h3 className="text-sm font-medium text-gray-600">必要投資額</h3>
          <p className="text-2xl font-bold text-gray-900">
            ¥{roi?.investmentRequired.toLocaleString()}
          </p>
        </div>
        <div className="metric-card border-info-500">
          <h3 className="text-sm font-medium text-gray-600">投資回収期間</h3>
          <p className="text-2xl font-bold text-gray-900">
            {roi?.paybackPeriod.toFixed(1)}ヶ月
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">プロセス一覧</h3>
        <div className="space-y-4">
          {processes?.map((process) => (
            <div key={process.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{process.name}</h4>
                  <p className="text-sm text-gray-600">
                    タイプ: {process.type === 'receivables' ? '売掛金' : 
                           process.type === 'payables' ? '買掛金' : 
                           process.type === 'inventory' ? '在庫' : 'レポート'}
                  </p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  process.status === 'automated' ? 'bg-success-100 text-success-800' :
                  process.status === 'semi-automated' ? 'bg-warning-100 text-warning-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {process.status === 'automated' ? '自動化済' :
                   process.status === 'semi-automated' ? '部分自動化' : '手動'}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>自動化レベル</span>
                  <span>{process.automationLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full"
                    style={{ width: `${process.automationLevel}%` }}
                  />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">平均実行時間:</span>
                  <span className="ml-1 font-medium">{process.metrics.averageExecutionTime}分</span>
                </div>
                <div>
                  <span className="text-gray-600">エラー率:</span>
                  <span className="ml-1 font-medium">{process.metrics.errorRate}%</span>
                </div>
                <div>
                  <span className="text-gray-600">コスト削減:</span>
                  <span className="ml-1 font-medium">¥{process.metrics.costSavings.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {opportunities && opportunities.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">自動化提案</h3>
          <div className="space-y-4">
            {opportunities.slice(0, 3).map((opp) => (
              <div key={opp.processId} className="border rounded-lg p-4 bg-primary-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{opp.processName}</h4>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    opp.implementationDifficulty === 'low' ? 'bg-success-100 text-success-800' :
                    opp.implementationDifficulty === 'medium' ? 'bg-warning-100 text-warning-800' :
                    'bg-danger-100 text-danger-800'
                  }`}>
                    難易度: {opp.implementationDifficulty === 'low' ? '低' :
                           opp.implementationDifficulty === 'medium' ? '中' : '高'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">削減可能時間</p>
                    <p className="font-semibold">{opp.potentialSavings.timeHours.toFixed(1)}時間/月</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">年間削減額</p>
                    <p className="font-semibold">¥{opp.potentialSavings.costYen.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-600">ROI</p>
                  <p className="text-2xl font-bold text-primary-600">{opp.roi.toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">推奨施策:</p>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {opp.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}