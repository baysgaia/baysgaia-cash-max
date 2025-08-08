import { useQuery } from '@tanstack/react-query';
import { fetchDailyCashflow, fetchWeeklyForecast } from '../api/cashflow';
import CashflowChart from '../components/CashflowChart';
import TransactionList from '../components/TransactionList';

export default function CashFlow() {
  const { data: dailyCashflow, isLoading: dailyLoading } = useQuery({
    queryKey: ['dailyCashflow'],
    queryFn: fetchDailyCashflow,
    refetchInterval: 300000,
  });

  const { data: forecast, isLoading: forecastLoading } = useQuery({
    queryKey: ['weeklyForecast'],
    queryFn: fetchWeeklyForecast,
  });

  if (dailyLoading || forecastLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">データを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">キャッシュフロー分析</h2>
        <p className="text-gray-600">日次キャッシュフローと予測</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="metric-card border-primary-500">
          <h3 className="text-sm font-medium text-gray-600">本日の入金</h3>
          <p className="text-2xl font-bold text-gray-900">
            ¥{dailyCashflow?.todayInflow.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{dailyCashflow?.inflowCount}件</p>
        </div>
        <div className="metric-card border-warning-500">
          <h3 className="text-sm font-medium text-gray-600">本日の出金</h3>
          <p className="text-2xl font-bold text-gray-900">
            ¥{dailyCashflow?.todayOutflow.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{dailyCashflow?.outflowCount}件</p>
        </div>
        <div className="metric-card border-success-500">
          <h3 className="text-sm font-medium text-gray-600">純増減</h3>
          <p className={`text-2xl font-bold ${dailyCashflow?.netFlow >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {dailyCashflow?.netFlow >= 0 ? '+' : ''}¥{dailyCashflow?.netFlow.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">前日比</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">30日間のキャッシュフロー推移</h3>
        <CashflowChart data={dailyCashflow?.history} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">7日間予測</h3>
          <div className="space-y-2">
            {forecast?.map((day) => (
              <div key={day.date} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">
                  {new Date(day.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                </span>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    予測残高: ¥{day.balance.toLocaleString()}
                  </p>
                  <p className={`text-xs ${day.confidence >= 90 ? 'text-success-600' : 'text-warning-600'}`}>
                    信頼度: {day.confidence}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">最近の取引</h3>
          <TransactionList />
        </div>
      </div>
    </div>
  );
}