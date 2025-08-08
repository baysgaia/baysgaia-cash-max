interface KPIProgressBarProps {
  name: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
}

export default function KPIProgressBar({ name, current, target, unit, deadline }: KPIProgressBarProps) {
  const progress = (current / target) * 100;
  const isOnTrack = progress >= 80;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-gray-500">{deadline}</span>
      </div>
      <div className="relative">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${Math.min(progress, 100)}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
              isOnTrack ? 'bg-success-500' : 'bg-warning-500'
            }`}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span>現在: {current}{unit}</span>
        <span>目標: {target}{unit}</span>
      </div>
    </div>
  );
}