import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../app/router/app_router.dart';
import '../../features/auth/providers/auth_provider.dart';
import '../../shared/widgets/layouts/responsive_layout.dart';
import '../../core/utils/logger.dart';

/// メインレイアウトウィジェット
class MainLayout extends ConsumerWidget {
  final Widget child;

  const MainLayout({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ResponsiveLayout(
      mobile: _MobileLayout(child: child),
      tablet: _TabletLayout(child: child),
      desktop: _DesktopLayout(child: child),
    );
  }
}

/// モバイルレイアウト
class _MobileLayout extends ConsumerWidget {
  final Widget child;

  const _MobileLayout({required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentRoute = GoRouterState.of(context).matchedLocation;

    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _getCurrentIndex(currentRoute),
        onTap: (index) => _onTap(context, index),
        selectedItemColor: Theme.of(context).primaryColor,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'ダッシュボード',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.analytics),
            label: 'KPI',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet),
            label: 'キャッシュフロー',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.monetization_on),
            label: '補助金',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: '設定',
          ),
        ],
      ),
    );
  }

  int _getCurrentIndex(String currentRoute) {
    switch (currentRoute) {
      case AppRoutes.dashboard:
        return 0;
      case AppRoutes.kpiDetails:
        return 1;
      case AppRoutes.cashflow:
        return 2;
      case AppRoutes.subsidy:
        return 3;
      case AppRoutes.settings:
        return 4;
      default:
        return 0;
    }
  }

  void _onTap(BuildContext context, int index) {
    final routes = [
      AppRoutes.dashboard,
      AppRoutes.kpiDetails,
      AppRoutes.cashflow,
      AppRoutes.subsidy,
      AppRoutes.settings,
    ];
    
    if (index < routes.length) {
      context.go(routes[index]);
    }
  }
}

/// タブレットレイアウト
class _TabletLayout extends ConsumerWidget {
  final Widget child;

  const _TabletLayout({required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Row(
        children: [
          NavigationRail(
            selectedIndex: _getCurrentIndex(GoRouterState.of(context).matchedLocation),
            onDestinationSelected: (index) => _onDestinationSelected(context, index),
            labelType: NavigationRailLabelType.all,
            destinations: const [
              NavigationRailDestination(
                icon: Icon(Icons.dashboard),
                label: Text('ダッシュボード'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.analytics),
                label: Text('KPI詳細'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.account_balance_wallet),
                label: Text('キャッシュフロー'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.monetization_on),
                label: Text('補助金・融資'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.settings),
                label: Text('設定'),
              ),
            ],
          ),
          const VerticalDivider(thickness: 1, width: 1),
          Expanded(
            child: Column(
              children: [
                _AppBarSection(),
                Expanded(child: child),
              ],
            ),
          ),
        ],
      ),
    );
  }

  int _getCurrentIndex(String currentRoute) {
    switch (currentRoute) {
      case AppRoutes.dashboard:
        return 0;
      case AppRoutes.kpiDetails:
        return 1;
      case AppRoutes.cashflow:
        return 2;
      case AppRoutes.subsidy:
        return 3;
      case AppRoutes.settings:
        return 4;
      default:
        return 0;
    }
  }

  void _onDestinationSelected(BuildContext context, int index) {
    final routes = [
      AppRoutes.dashboard,
      AppRoutes.kpiDetails,
      AppRoutes.cashflow,
      AppRoutes.subsidy,
      AppRoutes.settings,
    ];
    
    if (index < routes.length) {
      context.go(routes[index]);
    }
  }
}

/// デスクトップレイアウト
class _DesktopLayout extends ConsumerWidget {
  final Widget child;

  const _DesktopLayout({required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Row(
        children: [
          _SideNavigation(),
          Expanded(
            child: Column(
              children: [
                _AppBarSection(),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(24),
                    child: child,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// サイドナビゲーション
class _SideNavigation extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final currentRoute = GoRouterState.of(context).matchedLocation;

    return Container(
      width: 280,
      color: theme.colorScheme.surface,
      child: Column(
        children: [
          Container(
            height: 80,
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(
                  Icons.account_balance_wallet,
                  size: 32,
                  color: theme.primaryColor,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'BAYSGAiA',
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '財務改革システム',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurface.withOpacity(0.6),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 8),
              children: [
                _NavigationGroup(
                  title: '主要機能',
                  items: [
                    _NavigationItem(
                      icon: Icons.dashboard,
                      label: 'ダッシュボード',
                      route: AppRoutes.dashboard,
                      isSelected: currentRoute == AppRoutes.dashboard,
                    ),
                    _NavigationItem(
                      icon: Icons.analytics,
                      label: 'KPI詳細',
                      route: AppRoutes.kpiDetails,
                      isSelected: currentRoute == AppRoutes.kpiDetails,
                    ),
                    _NavigationItem(
                      icon: Icons.account_balance_wallet,
                      label: 'キャッシュフロー',
                      route: AppRoutes.cashflow,
                      isSelected: currentRoute == AppRoutes.cashflow,
                    ),
                  ],
                ),
                _NavigationGroup(
                  title: '管理機能',
                  items: [
                    _NavigationItem(
                      icon: Icons.monetization_on,
                      label: '補助金・融資',
                      route: AppRoutes.subsidy,
                      isSelected: currentRoute == AppRoutes.subsidy,
                    ),
                    _NavigationItem(
                      icon: Icons.settings_applications,
                      label: 'プロセス管理',
                      route: AppRoutes.process,
                      isSelected: currentRoute == AppRoutes.process,
                    ),
                    _NavigationItem(
                      icon: Icons.warning,
                      label: 'リスク管理',
                      route: AppRoutes.risk,
                      isSelected: currentRoute == AppRoutes.risk,
                    ),
                    _NavigationItem(
                      icon: Icons.folder_open,
                      label: 'プロジェクト',
                      route: AppRoutes.project,
                      isSelected: currentRoute == AppRoutes.project,
                    ),
                  ],
                ),
                _NavigationGroup(
                  title: 'システム',
                  items: [
                    _NavigationItem(
                      icon: Icons.settings,
                      label: '設定',
                      route: AppRoutes.settings,
                      isSelected: currentRoute == AppRoutes.settings,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// ナビゲーショングループ
class _NavigationGroup extends StatelessWidget {
  final String title;
  final List<_NavigationItem> items;

  const _NavigationGroup({
    required this.title,
    required this.items,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: Text(
            title,
            style: theme.textTheme.labelSmall?.copyWith(
              color: theme.colorScheme.onSurface.withOpacity(0.6),
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
            ),
          ),
        ),
        ...items,
        const SizedBox(height: 16),
      ],
    );
  }
}

/// ナビゲーションアイテム
class _NavigationItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String route;
  final bool isSelected;

  const _NavigationItem({
    required this.icon,
    required this.label,
    required this.route,
    required this.isSelected,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        color: isSelected ? theme.primaryColor.withOpacity(0.1) : null,
      ),
      child: ListTile(
        leading: Icon(
          icon,
          color: isSelected
              ? theme.primaryColor
              : theme.colorScheme.onSurface.withOpacity(0.7),
        ),
        title: Text(
          label,
          style: TextStyle(
            color: isSelected
                ? theme.primaryColor
                : theme.colorScheme.onSurface,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
        onTap: () {
          AppLogger.navigation(GoRouterState.of(context).matchedLocation, route);
          context.go(route);
        },
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        dense: true,
      ),
    );
  }
}

/// アプリバーセクション
class _AppBarSection extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(currentUserProvider);
    final theme = Theme.of(context);

    return Container(
      height: 64,
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            offset: const Offset(0, 1),
            blurRadius: 3,
          ),
        ],
      ),
      child: Row(
        children: [
          const Expanded(child: SizedBox()), // 空白で右寄せ
          if (user != null) ...[
            Text(
              user.displayName,
              style: theme.textTheme.bodyMedium,
            ),
            const SizedBox(width: 16),
            PopupMenuButton<String>(
              child: CircleAvatar(
                backgroundColor: theme.primaryColor,
                child: Text(
                  user.initials,
                  style: TextStyle(
                    color: theme.colorScheme.onPrimary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              itemBuilder: (context) => [
                PopupMenuItem(
                  value: 'profile',
                  child: Row(
                    children: const [
                      Icon(Icons.person),
                      SizedBox(width: 8),
                      Text('プロフィール'),
                    ],
                  ),
                ),
                PopupMenuItem(
                  value: 'settings',
                  child: Row(
                    children: const [
                      Icon(Icons.settings),
                      SizedBox(width: 8),
                      Text('設定'),
                    ],
                  ),
                ),
                const PopupMenuDivider(),
                PopupMenuItem(
                  value: 'logout',
                  child: Row(
                    children: const [
                      Icon(Icons.logout, color: Colors.red),
                      SizedBox(width: 8),
                      Text('ログアウト', style: TextStyle(color: Colors.red)),
                    ],
                  ),
                ),
              ],
              onSelected: (value) => _onMenuSelected(context, ref, value),
            ),
          ],
          const SizedBox(width: 16),
        ],
      ),
    );
  }

  void _onMenuSelected(BuildContext context, WidgetRef ref, String value) {
    switch (value) {
      case 'profile':
        // TODO: プロフィール画面に遷移
        break;
      case 'settings':
        context.go(AppRoutes.settings);
        break;
      case 'logout':
        ref.read(authStateProvider.notifier).logout();
        break;
    }
  }
}