import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { fetchAlerts } from '../api/alerts';

export default function AlertBanner() {
  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: fetchAlerts,
    refetchInterval: 60000,
  });

  if (!alerts || alerts.length === 0) {
    return null;
  }

  const alert = alerts[0];
  
  const bgColor = {
    critical: 'bg-danger-50 border-danger-500 text-danger-700',
    warning: 'bg-warning-50 border-warning-500 text-warning-700',
    info: 'bg-primary-50 border-primary-500 text-primary-700',
  }[alert.level];

  const icon = {
    critical: '🚨',
    warning: '⚠️',
    info: 'ℹ️',
  }[alert.level];

  return (
    <div className={clsx('p-4 rounded-md border-l-4', bgColor)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{alert.message}</p>
          <p className="text-xs mt-1">{new Date(alert.timestamp).toLocaleString('ja-JP')}</p>
        </div>
      </div>
    </div>
  );
}