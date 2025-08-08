import { clsx } from 'clsx';

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  target?: string;
  status?: 'success' | 'warning' | 'danger';
}

export default function MetricCard({ title, value, change, target, status = 'success' }: MetricCardProps) {
  const borderColor = {
    success: 'border-success-500',
    warning: 'border-warning-500',
    danger: 'border-danger-500',
  }[status];

  return (
    <div className={clsx('metric-card', borderColor)}>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      
      {change !== undefined && (
        <p className={clsx('text-sm mt-1', change >= 0 ? 'text-success-600' : 'text-danger-600')}>
          {change >= 0 ? '▲' : '▼'} {Math.abs(change)}%
        </p>
      )}
      
      {target && (
        <p className="text-xs text-gray-500 mt-1">
          目標: {target}
        </p>
      )}
    </div>
  );
}