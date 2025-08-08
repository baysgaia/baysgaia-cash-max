import { useQuery } from '@tanstack/react-query';
import { fetchSubsidies, fetchFundingSimulation } from '../../api/subsidy';

export default function SubsidyManagement() {
  const { data: subsidies, isLoading } = useQuery({
    queryKey: ['subsidies'],
    queryFn: fetchSubsidies,
  });

  const { data: simulation } = useQuery({
    queryKey: ['fundingSimulation'],
    queryFn: fetchFundingSimulation,
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
        <h2 className="text-2xl font-bold text-gray-900">補助金・融資管理</h2>
        <p className="text-gray-600">公的支援の申請状況と資金調達シミュレーション</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="metric-card border-primary-500">
          <h3 className="text-sm font-medium text-gray-600">申請中の補助金</h3>
          <p className="text-2xl font-bold text-gray-900">
            {subsidies?.filter(s => s.status === 'applied').length || 0}件
          </p>
        </div>
        <div className="metric-card border-success-500">
          <h3 className="text-sm font-medium text-gray-600">承認済み金額</h3>
          <p className="text-2xl font-bold text-gray-900">
            ¥{subsidies?.reduce((sum, s) => sum + (s.approvedAmount || 0), 0).toLocaleString() || 0}
          </p>
        </div>
        <div className="metric-card border-warning-500">
          <h3 className="text-sm font-medium text-gray-600">期待調達額</h3>
          <p className="text-2xl font-bold text-gray-900">
            ¥{simulation?.totalRequiredFunding.toLocaleString() || 0}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">申請状況一覧</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  制度名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  種別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最大金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申請期限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subsidies?.map((subsidy) => (
                <tr key={subsidy.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subsidy.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subsidy.type === 'grant' ? '助成金' : subsidy.type === 'loan' ? '融資' : '補助金'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ¥{subsidy.maxAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subsidy.applicationDeadline).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      subsidy.status === 'approved' ? 'bg-success-100 text-success-800' :
                      subsidy.status === 'applied' ? 'bg-primary-100 text-primary-800' :
                      subsidy.status === 'rejected' ? 'bg-danger-100 text-danger-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {subsidy.status === 'preparing' ? '準備中' :
                       subsidy.status === 'applied' ? '申請済' :
                       subsidy.status === 'approved' ? '承認済' :
                       subsidy.status === 'rejected' ? '不採択' : '受領済'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {simulation && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">資金調達シミュレーション</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">必要資金総額</p>
              <p className="text-xl font-bold">¥{simulation.totalRequiredFunding.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">補助金・助成金</h4>
                {simulation.subsidies.map((item, index) => (
                  <div key={index} className="text-sm mb-1">
                    <span className="text-gray-600">{item.subsidy.name}:</span>
                    <span className="ml-2">¥{item.expectedAmount.toLocaleString()}</span>
                    <span className="ml-2 text-gray-500">({Math.round(item.probability * 100)}%)</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-medium mb-2">融資</h4>
                {simulation.loans.map((loan, index) => (
                  <div key={index} className="text-sm mb-1">
                    <span className="text-gray-600">{loan.lender}:</span>
                    <span className="ml-2">¥{loan.amount.toLocaleString()}</span>
                    <span className="ml-2 text-gray-500">({loan.interestRate}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}