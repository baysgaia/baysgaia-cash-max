import { useQuery } from '@tanstack/react-query';
import { fetchKPIHistory } from '../api/kpi';
import KPIHistoryChart from '../components/KPIHistoryChart';
import KPIProgressBar from '../components/KPIProgressBar';

const kpiTargets = [
  { name: '月末現金残高', current: 5.2, target: 20, unit: '%', deadline: '3ヶ月以内' },
  { name: 'CCC短縮', current: 18, target: 25, unit: '%', deadline: '4ヶ月以内' },
  { name: 'DSO短縮', current: 22, target: 30, unit: '%', deadline: '2ヶ月以内' },
  { name: '資金予測精度', current: 92.5, target: 95, unit: '%', deadline: '2ヶ月以内' },
  { name: '自動化率', current: 35, target: 70, unit: '%', deadline: '4ヶ月以内' },
];

export default function KPIDetails() {
  const { data: history, isLoading } = useQuery({
    queryKey: ['kpiHistory'],
    queryFn: fetchKPIHistory,
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
        <h2 className="text-2xl font-bold text-gray-900">KPI詳細分析</h2>
        <p className="text-gray-600">各KPIの進捗状況と履歴データ</p>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">KPI達成状況</h3>
        <div className="space-y-4">
          {kpiTargets.map((kpi) => (
            <KPIProgressBar
              key={kpi.name}
              name={kpi.name}
              current={kpi.current}
              target={kpi.target}
              unit={kpi.unit}
              deadline={kpi.deadline}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">CCC構成要素推移</h3>
          <KPIHistoryChart data={history?.ccc || []} label="CCC" color="rgb(59, 130, 246)" />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">DSO推移</h3>
          <KPIHistoryChart data={history?.dso || []} label="DSO" color="rgb(34, 197, 94)" />
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">業界ベンチマーク比較</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  指標
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  当社
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  業界平均
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  業界トップ10%
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  CCC
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  75日
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  85日
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  45日
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  DSO
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  65日
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  70日
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  40日
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  流動比率
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  150%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  140%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  200%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}