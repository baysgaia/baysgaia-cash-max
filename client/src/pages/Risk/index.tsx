import { useQuery } from '@tanstack/react-query';
import { fetchRisks, fetchRiskMatrix, fetchActiveAlerts, fetchComplianceStatus } from '../../api/risk';

export default function RiskManagement() {
  const { data: risks, isLoading } = useQuery({
    queryKey: ['risks'],
    queryFn: fetchRisks,
  });

  const { data: matrix } = useQuery({
    queryKey: ['riskMatrix'],
    queryFn: fetchRiskMatrix,
  });

  const { data: alerts } = useQuery({
    queryKey: ['activeAlerts'],
    queryFn: fetchActiveAlerts,
  });

  const { data: compliance } = useQuery({
    queryKey: ['complianceStatus'],
    queryFn: fetchComplianceStatus,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">データを読み込み中...</div>
      </div>
    );
  }

  const getRiskColor = (score: number) => {
    if (score >= 7) return 'bg-danger-100 text-danger-800 border-danger-500';
    if (score >= 4) return 'bg-warning-100 text-warning-800 border-warning-500';
    return 'bg-success-100 text-success-800 border-success-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">リスク管理・ガバナンス</h2>
        <p className="text-gray-600">リスクモニタリングとコンプライアンス管理</p>
      </div>

      {alerts && alerts.length > 0 && (
        <div className="bg-danger-50 border-l-4 border-danger-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-danger-800">アクティブアラート</h3>
              <div className="mt-2 text-sm text-danger-700">
                <ul className="list-disc list-inside space-y-1">
                  {alerts.slice(0, 3).map((alert) => (
                    <li key={alert.id}>{alert.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="metric-card border-danger-500">
          <h3 className="text-sm font-medium text-gray-600">重大リスク</h3>
          <p className="text-2xl font-bold text-gray-900">
            {risks?.filter(r => r.riskScore >= 7).length || 0}件
          </p>
        </div>
        <div className="metric-card border-warning-500">
          <h3 className="text-sm font-medium text-gray-600">中程度リスク</h3>
          <p className="text-2xl font-bold text-gray-900">
            {risks?.filter(r => r.riskScore >= 4 && r.riskScore < 7).length || 0}件
          </p>
        </div>
        <div className="metric-card border-success-500">
          <h3 className="text-sm font-medium text-gray-600">コンプライアンス率</h3>
          <p className="text-2xl font-bold text-gray-900">
            {compliance?.complianceRate.toFixed(0)}%
          </p>
        </div>
        <div className="metric-card border-primary-500">
          <h3 className="text-sm font-medium text-gray-600">対策実施中</h3>
          <p className="text-2xl font-bold text-gray-900">
            {risks?.reduce((sum, r) => sum + r.mitigationActions.filter(m => m.status === 'in_progress').length, 0) || 0}件
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">リスクマトリクス</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center text-sm font-medium text-gray-600">低確率</div>
          <div className="text-center text-sm font-medium text-gray-600">中確率</div>
          <div className="text-center text-sm font-medium text-gray-600">高確率</div>
          
          <div className="border-2 border-gray-200 p-4 min-h-[100px] bg-yellow-50">
            <p className="text-xs text-gray-500 mb-1">高影響・低確率</p>
            {matrix?.highImpactLowProb.map(risk => (
              <div key={risk.id} className="text-xs mb-1">{risk.name}</div>
            ))}
          </div>
          <div className="border-2 border-gray-200 p-4 min-h-[100px] bg-orange-50">
            <p className="text-xs text-gray-500 mb-1">高影響・中確率</p>
            {matrix?.highImpactMedProb.map(risk => (
              <div key={risk.id} className="text-xs mb-1">{risk.name}</div>
            ))}
          </div>
          <div className="border-2 border-gray-200 p-4 min-h-[100px] bg-red-50">
            <p className="text-xs text-gray-500 mb-1">高影響・高確率</p>
            {matrix?.highImpactHighProb.map(risk => (
              <div key={risk.id} className="text-xs mb-1">{risk.name}</div>
            ))}
          </div>
          
          <div className="border-2 border-gray-200 p-4 min-h-[100px] bg-green-50">
            <p className="text-xs text-gray-500 mb-1">中影響・低確率</p>
            {matrix?.medImpactLowProb.map(risk => (
              <div key={risk.id} className="text-xs mb-1">{risk.name}</div>
            ))}
          </div>
          <div className="border-2 border-gray-200 p-4 min-h-[100px] bg-yellow-50">
            <p className="text-xs text-gray-500 mb-1">中影響・中確率</p>
            {matrix?.medImpactMedProb.map(risk => (
              <div key={risk.id} className="text-xs mb-1">{risk.name}</div>
            ))}
          </div>
          <div className="border-2 border-gray-200 p-4 min-h-[100px] bg-orange-50">
            <p className="text-xs text-gray-500 mb-1">中影響・高確率</p>
            {matrix?.medImpactHighProb.map(risk => (
              <div key={risk.id} className="text-xs mb-1">{risk.name}</div>
            ))}
          </div>
          
          <div className="border-2 border-gray-200 p-4 min-h-[100px] bg-green-50">
            <p className="text-xs text-gray-500 mb-1">低影響・低確率</p>
            {matrix?.lowImpactLowProb.map(risk => (
              <div key={risk.id} className="text-xs mb-1">{risk.name}</div>
            ))}
          </div>
          <div className="border-2 border-gray-200 p-4 min-h-[100px] bg-green-50">
            <p className="text-xs text-gray-500 mb-1">低影響・中確率</p>
            {matrix?.lowImpactMedProb.map(risk => (
              <div key={risk.id} className="text-xs mb-1">{risk.name}</div>
            ))}
          </div>
          <div className="border-2 border-gray-200 p-4 min-h-[100px] bg-yellow-50">
            <p className="text-xs text-gray-500 mb-1">低影響・高確率</p>
            {matrix?.lowImpactHighProb.map(risk => (
              <div key={risk.id} className="text-xs mb-1">{risk.name}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">主要リスク一覧</h3>
        <div className="space-y-4">
          {risks?.map((risk) => (
            <div key={risk.id} className={`border-l-4 rounded-lg p-4 ${getRiskColor(risk.riskScore)}`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{risk.name}</h4>
                  <p className="text-sm mt-1">{risk.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{risk.riskScore}</div>
                  <div className="text-xs">リスクスコア</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">影響度:</span>
                  <span className="ml-1 font-medium">{risk.impact === 3 ? '高' : risk.impact === 2 ? '中' : '低'}</span>
                </div>
                <div>
                  <span className="text-gray-600">発生確率:</span>
                  <span className="ml-1 font-medium">{risk.probability === 3 ? '高' : risk.probability === 2 ? '中' : '低'}</span>
                </div>
                <div>
                  <span className="text-gray-600">責任者:</span>
                  <span className="ml-1 font-medium">{risk.owner}</span>
                </div>
              </div>
              {risk.mitigationActions.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">対策:</p>
                  <ul className="text-sm list-disc list-inside">
                    {risk.mitigationActions.map((action) => (
                      <li key={action.id} className="flex items-center">
                        <span>{action.action}</span>
                        <span className={`ml-2 inline-flex px-2 py-0.5 text-xs rounded-full ${
                          action.status === 'completed' ? 'bg-success-100 text-success-800' :
                          action.status === 'in_progress' ? 'bg-primary-100 text-primary-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {action.status === 'completed' ? '完了' :
                           action.status === 'in_progress' ? '実施中' : '計画中'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {compliance && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">コンプライアンス状況</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">遵守項目</span>
                  <span className="font-medium">{compliance.compliant}/{compliance.totalCheckpoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">未遵守項目</span>
                  <span className="font-medium text-danger-600">{compliance.nonCompliant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">確認待ち</span>
                  <span className="font-medium text-warning-600">{compliance.pending}</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">今後の確認予定</p>
              <ul className="space-y-1">
                {compliance.upcomingChecks.map((check) => (
                  <li key={check.id} className="text-sm">
                    <span className="text-gray-600">
                      {new Date(check.nextCheck).toLocaleDateString('ja-JP')}:
                    </span>
                    <span className="ml-2">{check.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}