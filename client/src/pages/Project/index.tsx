import { useQuery } from '@tanstack/react-query';
import { fetchProject, fetchProjectTimeline, fetchProjectReport } from '../../api/project';

export default function ProjectManagement() {
  const { data: project, isLoading } = useQuery({
    queryKey: ['project'],
    queryFn: fetchProject,
  });

  const { data: timeline } = useQuery({
    queryKey: ['projectTimeline'],
    queryFn: fetchProjectTimeline,
  });

  const { data: report } = useQuery({
    queryKey: ['projectReport'],
    queryFn: fetchProjectReport,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">データを読み込み中...</div>
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'green': return 'bg-success-100 text-success-800';
      case 'yellow': return 'bg-warning-100 text-warning-800';
      case 'red': return 'bg-danger-100 text-danger-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'text-success-600';
      case 'on_track': return 'text-primary-600';
      case 'at_risk': return 'text-warning-600';
      case 'missed': return 'text-danger-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{project?.name}</h2>
        <p className="text-gray-600">プロジェクト進捗管理とフェーズ管理</p>
      </div>

      {report && (
        <div className={`p-4 rounded-lg ${getHealthColor(report.overallHealth)}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">プロジェクトヘルス</h3>
              <p className="text-sm mt-1">
                最終更新: {new Date(report.reportDate).toLocaleDateString('ja-JP')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{project?.progress}%</p>
              <p className="text-sm">全体進捗</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">現在のフェーズ</h3>
          <div className="bg-primary-50 p-4 rounded-lg">
            <h4 className="font-medium text-primary-900">
              Phase {project?.phase.number}: {project?.phase.name}
            </h4>
            <p className="text-sm text-primary-700 mt-1">{project?.phase.description}</p>
            <p className="text-sm mt-2">期間: {project?.phase.duration}</p>
            <div className="mt-3">
              <p className="text-sm font-medium mb-1">完了基準:</p>
              <ul className="text-sm text-primary-700 list-disc list-inside">
                {project?.phase.completionCriteria.map((criteria, index) => (
                  <li key={index}>{criteria}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">予算状況</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>予算消化率</span>
                <span>{((project?.budget.spent || 0) / (project?.budget.total || 1) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${(project?.budget.spent || 0) / (project?.budget.total || 1) * 100}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">総予算</p>
                <p className="font-semibold">¥{project?.budget.total.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">支出済み</p>
                <p className="font-semibold">¥{project?.budget.spent.toLocaleString()}</p>
              </div>
            </div>
            {report && (
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">日次支出率</p>
                <p className="font-semibold">¥{report.budgetStatus.burnRate.toLocaleString()}/日</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">OKR進捗状況</h3>
        <div className="space-y-4">
          {project?.objectives.map((objective) => (
            <div key={objective.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{objective.name}</h4>
                  <p className="text-sm text-gray-600">{objective.description}</p>
                </div>
                <span className={`font-semibold ${getStatusColor(objective.status)}`}>
                  {objective.currentValue}{objective.unit} / {objective.targetValue}{objective.unit}
                </span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>進捗率</span>
                  <span>{((objective.currentValue / objective.targetValue) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      objective.status === 'achieved' ? 'bg-success-500' :
                      objective.status === 'on_track' ? 'bg-primary-500' :
                      objective.status === 'at_risk' ? 'bg-warning-500' :
                      'bg-danger-500'
                    }`}
                    style={{ width: `${Math.min((objective.currentValue / objective.targetValue) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  期限: {new Date(objective.deadline).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {timeline && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">マイルストーン</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">完了済み</h4>
              {timeline.completedMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center mb-2">
                  <span className="text-success-600 mr-2">✓</span>
                  <span className="text-sm">{milestone.name}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {new Date(milestone.dueDate).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-medium mb-2">今後の予定</h4>
              {timeline.upcomingMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center mb-2">
                  <span className="text-gray-400 mr-2">○</span>
                  <span className="text-sm">{milestone.name}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {new Date(milestone.dueDate).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {report && (report.risks.length > 0 || report.issues.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {report.risks.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-warning-600">リスク</h3>
              <ul className="space-y-2">
                {report.risks.map((risk, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-warning-600 mr-2">⚠</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report.issues.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-danger-600">課題</h3>
              <ul className="space-y-2">
                {report.issues.map((issue, index) => (
                  <li key={index} className="text-sm flex items-start">
                    <span className="text-danger-600 mr-2">!</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}