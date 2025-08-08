import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

interface KPIHistoryChartProps {
  data: Array<{ date: string; value: number }>;
  label: string;
  color: string;
}

export default function KPIHistoryChart({ data, label, color }: KPIHistoryChartProps) {
  if (!data) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label,
        data: data.map(d => d.value),
        borderColor: color,
        backgroundColor: `${color}20`,
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
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return <Line data={chartData} options={options} />;
}