import { useQuery } from '@tanstack/react-query';
import MetricCard from '../components/MetricCard';
import CashBalanceChart from '../components/CashBalanceChart';
import KPITrendChart from '../components/KPITrendChart';
import AlertBanner from '../components/AlertBanner';
import { fetchKPIs, fetchCashBalance } from '../api/dashboard';

export default function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: fetchKPIs,
    refetchInterval: 60000,
  });

  const { data: cashBalance, isLoading: balanceLoading } = useQuery({
    queryKey: ['cashBalance'],
    queryFn: fetchCashBalance,
    refetchInterval: 60000,
  });

  if (kpisLoading || balanceLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">データを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          エグゼクティブサマリー
        </h2>
        <p className="text-gray-600">
          主要KPIと財務状況の概要
        </p>
      </div>

      <AlertBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="現金残高"
          value={`¥${cashBalance?.balance.toLocaleString()}`}
          change={cashBalance?.changePercent}
          status={(cashBalance?.changePercent ?? 0) >= 0 ? 'success' : 'danger'}
        />
        <MetricCard
          title="CCC (日数)"
          value={(kpis?.ccc ?? 0).toString()}
          target="56"
          status={(kpis?.ccc ?? 0) <= 56 ? 'success' : 'warning'}
        />
        <MetricCard
          title="DSO (日数)"
          value={(kpis?.dso ?? 0).toString()}
          target="45"
          status={(kpis?.dso ?? 0) <= 45 ? 'success' : 'warning'}
        />
        <MetricCard
          title="資金予測精度"
          value={`${kpis?.forecastAccuracy ?? 0}%`}
          target="95%"
          status={(kpis?.forecastAccuracy ?? 0) >= 95 ? 'success' : 'warning'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">現金残高推移</h3>
          <CashBalanceChart />
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">KPI進捗状況</h3>
          <KPITrendChart />
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">ROI / 効果測定</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">運転資本解放額</p>
            <p className="text-2xl font-bold text-primary-600">
              ¥33,013,699
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">コスト削減額（年間）</p>
            <p className="text-2xl font-bold text-success-600">
              ¥1,884,000
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">ROI</p>
            <p className="text-2xl font-bold text-success-700">
              775%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}