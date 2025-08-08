import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

interface CashflowData {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
}

interface CashflowChartProps {
  data?: CashflowData[];
}

export default function CashflowChart({ data }: CashflowChartProps) {
  if (!data) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: '入金',
        data: data.map(d => d.inflow),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: '出金',
        data: data.map(d => -d.outflow),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = Math.abs(context.parsed.y);
            return `${context.dataset.label}: ¥${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => {
            const absValue = Math.abs(Number(value));
            return `¥${absValue.toLocaleString()}`;
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}