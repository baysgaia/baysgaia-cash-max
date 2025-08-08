import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const kpiData = [
  { name: '現金残高増加', current: 5.2, target: 20 },
  { name: 'CCC短縮', current: 18, target: 25 },
  { name: 'DSO短縮', current: 22, target: 30 },
  { name: '予測精度', current: 92.5, target: 95 },
  { name: '自動化率', current: 35, target: 70 },
];

export default function KPITrendChart() {
  const chartData = {
    labels: kpiData.map(d => d.name),
    datasets: [
      {
        label: '現在値',
        data: kpiData.map(d => d.current),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: '目標値',
        data: kpiData.map(d => d.target),
        backgroundColor: 'rgba(34, 197, 94, 0.3)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
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
            return `${context.dataset.label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}