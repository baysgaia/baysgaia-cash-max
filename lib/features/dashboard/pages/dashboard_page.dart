import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/utils/logger.dart';
import '../../../shared/widgets/layouts/responsive_layout.dart';
import '../../../core/theme/app_theme.dart';

/// ダッシュボードページ
class DashboardPage extends ConsumerStatefulWidget {
  const DashboardPage({super.key});

  @override
  ConsumerState<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends ConsumerState<DashboardPage> {
  @override
  void initState() {
    super.initState();
    AppLogger.info('ダッシュボードページ初期化');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ダッシュボード'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _onRefresh,
            tooltip: 'データを更新',
          ),
        ],
      ),
      body: ResponsiveLayout(
        mobile: _buildMobileLayout(),
        tablet: _buildTabletLayout(),
        desktop: _buildDesktopLayout(),
      ),
    );
  }

  Widget _buildMobileLayout() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildWelcomeSection(),
          const SizedBox(height: 24),
          _buildKpiOverview(),
          const SizedBox(height: 24),
          _buildQuickActions(),
          const SizedBox(height: 24),
          _buildRecentActivity(),
        ],
      ),
    );
  }

  Widget _buildTabletLayout() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildWelcomeSection(),
          const SizedBox(height: 32),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 2,
                child: Column(
                  children: [
                    _buildKpiOverview(),
                    const SizedBox(height: 24),
                    _buildRecentActivity(),
                  ],
                ),
              ),
              const SizedBox(width: 24),
              Expanded(
                child: _buildQuickActions(),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDesktopLayout() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildWelcomeSection(),
          const SizedBox(height: 32),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 3,
                child: Column(
                  children: [
                    _buildKpiOverview(),
                    const SizedBox(height: 32),
                    _buildDetailedAnalytics(),
                  ],
                ),
              ),
              const SizedBox(width: 32),
              Expanded(
                child: Column(
                  children: [
                    _buildQuickActions(),
                    const SizedBox(height: 24),
                    _buildRecentActivity(),
                    const SizedBox(height: 24),
                    _buildUpcomingTasks(),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeSection() {
    return Card(
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: LinearGradient(
            colors: [
              AppTheme.primaryColor,
              AppTheme.primaryLightColor,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(
                  Icons.account_balance_wallet,
                  color: Colors.white,
                  size: 32,
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'BAYSGAiA 財務改革システム',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        'Phase 2: システム導入実行中',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              '現金残高最大化プロジェクト（2025年8月〜12月）',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: 0.35, // 35%進捗（Phase 2）
              backgroundColor: Colors.white24,
              valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
            ),
            const SizedBox(height: 8),
            Text(
              'プロジェクト進捗: 35%完了',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.white70,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiOverview() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'OKR主要指標',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildKpiGrid(),
          ],
        ),
      ),
    );
  }

  Widget _buildKpiGrid() {
    final kpis = [
      _KpiData(
        title: '月末現金残高',
        value: '+5.2%',
        target: '+20%',
        status: 'warning',
        icon: Icons.account_balance_wallet,
        description: '目標値まで+14.8%不足',
      ),
      _KpiData(
        title: 'キャッシュ転換日数',
        value: '-18%',
        target: '-25%',
        status: 'info',
        icon: Icons.access_time,
        description: 'CCCの削減が順調に進行',
      ),
      _KpiData(
        title: '売上債権回収日数',
        value: '-22%',
        target: '-30%',
        status: 'success',
        icon: Icons.trending_down,
        description: 'DSO短縮効果が顕著',
      ),
      _KpiData(
        title: '資金予測精度',
        value: '92.5%',
        target: '≥95%',
        status: 'success',
        icon: Icons.analytics,
        description: '目標値に近づいている',
      ),
    ];

    return ResponsiveGrid(
      crossAxisCount: ResponsiveValue(
        mobile: 1,
        tablet: 2,
        desktop: 2,
      ),
      children: kpis.map((kpi) => _buildKpiCard(kpi)).toList(),
    );
  }

  Widget _buildKpiCard(_KpiData kpi) {
    final statusColor = _getStatusColor(kpi.status);
    
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(
                    kpi.icon,
                    color: statusColor,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        kpi.title,
                        style: Theme.of(context).textTheme.titleSmall,
                      ),
                      Text(
                        '目標: ${kpi.target}',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              kpi.value,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                color: statusColor,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              kpi.description,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'クイックアクション',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildActionButton(
              icon: Icons.analytics,
              title: 'KPI詳細分析',
              subtitle: '詳細なKPI分析を表示',
              onTap: () => AppLogger.userAction('navigate_to_kpi_details'),
            ),
            const SizedBox(height: 8),
            _buildActionButton(
              icon: Icons.account_balance_wallet,
              title: 'キャッシュフロー',
              subtitle: '資金フロー分析',
              onTap: () => AppLogger.userAction('navigate_to_cashflow'),
            ),
            const SizedBox(height: 8),
            _buildActionButton(
              icon: Icons.monetization_on,
              title: '補助金・融資',
              subtitle: '申請状況を確認',
              onTap: () => AppLogger.userAction('navigate_to_subsidy'),
            ),
            const SizedBox(height: 8),
            _buildActionButton(
              icon: Icons.settings,
              title: '設定',
              subtitle: 'システム設定',
              onTap: () => AppLogger.userAction('navigate_to_settings'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.primaryColor),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
      contentPadding: EdgeInsets.zero,
    );
  }

  Widget _buildRecentActivity() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '最近のアクティビティ',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildActivityItem(
              icon: Icons.trending_up,
              title: 'DSO改善',
              description: '売上債権回収日数が22%改善しました',
              time: '2時間前',
              color: Colors.green,
            ),
            const SizedBox(height: 12),
            _buildActivityItem(
              icon: Icons.warning,
              title: '現金残高アラート',
              description: '月末残高目標に対して14.8%不足',
              time: '4時間前',
              color: Colors.orange,
            ),
            const SizedBox(height: 12),
            _buildActivityItem(
              icon: Icons.file_download,
              title: 'IT導入補助金申請',
              description: '第5次申請書類を準備中',
              time: '1日前',
              color: Colors.blue,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActivityItem({
    required IconData icon,
    required String title,
    required String description,
    required String time,
    required Color color,
  }) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: color, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.titleSmall,
              ),
              Text(
                description,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
        Text(
          time,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: Colors.grey[500],
          ),
        ),
      ],
    );
  }

  Widget _buildDetailedAnalytics() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '詳細分析',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            Container(
              height: 200,
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Center(
                child: Text('チャート表示予定エリア'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildUpcomingTasks() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '今後の予定',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildTaskItem('IT導入補助金申請', '9月22日締切', Colors.red),
            const SizedBox(height: 8),
            _buildTaskItem('CEO週次レビュー', '毎週土曜日 8:00', Colors.blue),
            const SizedBox(height: 8),
            _buildTaskItem('月次経営報告', '月末', Colors.green),
          ],
        ),
      ),
    );
  }

  Widget _buildTaskItem(String title, String subtitle, Color color) {
    return Row(
      children: [
        Container(
          width: 4,
          height: 40,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: Theme.of(context).textTheme.titleSmall),
              Text(
                subtitle,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'success':
        return Colors.green;
      case 'warning':
        return Colors.orange;
      case 'error':
        return Colors.red;
      case 'info':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  void _onRefresh() {
    AppLogger.userAction('dashboard_refresh');
    // TODO: データの再読み込み処理を実装
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('データを更新しました')),
    );
  }
}

/// KPIデータクラス
class _KpiData {
  final String title;
  final String value;
  final String target;
  final String status;
  final IconData icon;
  final String description;

  const _KpiData({
    required this.title,
    required this.value,
    required this.target,
    required this.status,
    required this.icon,
    required this.description,
  });
}