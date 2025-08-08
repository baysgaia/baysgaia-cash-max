import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { useQuery } from '@tanstack/react-query';
import { fetchCashBalanceHistory } from '../api/dashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CashBalanceChart() {
  const { data: history } = useQuery({
    queryKey: ['cashBalanceHistory'],
    queryFn: fetchCashBalanceHistory,
  });

  if (!history) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: history.map(d => new Date(d.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: '現金残高',
        data: history.map(d => d.balance),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `¥${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `¥${Number(value).toLocaleString()}`,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}