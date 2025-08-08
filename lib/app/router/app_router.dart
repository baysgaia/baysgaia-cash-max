import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/providers/auth_provider.dart';
import '../../features/auth/pages/login_page.dart';
import '../../features/dashboard/pages/dashboard_page.dart';
import '../../features/kpi/pages/kpi_details_page.dart';
import '../../features/cashflow/pages/cashflow_page.dart';
import '../../features/subsidy/pages/subsidy_page.dart';
import '../../features/process/pages/process_page.dart';
import '../../features/risk/pages/risk_page.dart';
import '../../features/project/pages/project_page.dart';
import '../../features/settings/pages/settings_page.dart';
import '../../shared/widgets/main_layout.dart';
import '../../core/utils/logger.dart';

/// ルート定義
class AppRoutes {
  // 認証関連
  static const String login = '/login';
  
  // メイン機能
  static const String dashboard = '/';
  static const String kpiDetails = '/kpi-details';
  static const String cashflow = '/cashflow';
  static const String subsidy = '/subsidy';
  static const String process = '/process';
  static const String risk = '/risk';
  static const String project = '/project';
  static const String settings = '/settings';
}

/// アプリケーションルーター
final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authStateProvider);
  
  return GoRouter(
    initialLocation: AppRoutes.dashboard,
    debugLogDiagnostics: true,
    
    // リダイレクト処理
    redirect: (context, state) {
      final isAuthenticated = authState.maybeWhen(
        authenticated: (_) => true,
        orElse: () => false,
      );
      
      final isLoginRoute = state.matchedLocation == AppRoutes.login;
      
      // 未認証でログインページ以外にアクセスした場合
      if (!isAuthenticated && !isLoginRoute) {
        AppLogger.navigation(state.matchedLocation, AppRoutes.login);
        return AppRoutes.login;
      }
      
      // 認証済みでログインページにアクセスした場合
      if (isAuthenticated && isLoginRoute) {
        AppLogger.navigation(AppRoutes.login, AppRoutes.dashboard);
        return AppRoutes.dashboard;
      }
      
      return null; // リダイレクトなし
    },
    
    routes: [
      // ログインページ
      GoRoute(
        path: AppRoutes.login,
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      
      // メインレイアウト内のルート
      ShellRoute(
        builder: (context, state, child) {
          return MainLayout(child: child);
        },
        routes: [
          // ダッシュボード
          GoRoute(
            path: AppRoutes.dashboard,
            name: 'dashboard',
            builder: (context, state) {
              AppLogger.navigation('', 'dashboard');
              return const DashboardPage();
            },
          ),
          
          // KPI詳細
          GoRoute(
            path: AppRoutes.kpiDetails,
            name: 'kpi-details',
            builder: (context, state) {
              AppLogger.navigation(state.path ?? '', 'kpi-details');
              return const KpiDetailsPage();
            },
          ),
          
          // キャッシュフロー
          GoRoute(
            path: AppRoutes.cashflow,
            name: 'cashflow',
            builder: (context, state) {
              AppLogger.navigation(state.path ?? '', 'cashflow');
              return const CashflowPage();
            },
          ),
          
          // 補助金・融資
          GoRoute(
            path: AppRoutes.subsidy,
            name: 'subsidy',
            builder: (context, state) {
              AppLogger.navigation(state.path ?? '', 'subsidy');
              return const SubsidyPage();
            },
          ),
          
          // プロセス自動化
          GoRoute(
            path: AppRoutes.process,
            name: 'process',
            builder: (context, state) {
              AppLogger.navigation(state.path ?? '', 'process');
              return const ProcessPage();
            },
          ),
          
          // リスク管理
          GoRoute(
            path: AppRoutes.risk,
            name: 'risk',
            builder: (context, state) {
              AppLogger.navigation(state.path ?? '', 'risk');
              return const RiskPage();
            },
          ),
          
          // プロジェクト管理
          GoRoute(
            path: AppRoutes.project,
            name: 'project',
            builder: (context, state) {
              AppLogger.navigation(state.path ?? '', 'project');
              return const ProjectPage();
            },
          ),
          
          // 設定
          GoRoute(
            path: AppRoutes.settings,
            name: 'settings',
            builder: (context, state) {
              AppLogger.navigation(state.path ?? '', 'settings');
              return const SettingsPage();
            },
          ),
        ],
      ),
    ],
    
    // エラーページ
    errorBuilder: (context, state) {
      AppLogger.error('Router error: ${state.error}');
      return Scaffold(
        appBar: AppBar(title: const Text('エラー')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              const Text('ページが見つかりません'),
              const SizedBox(height: 8),
              Text(
                'エラー: ${state.error}',
                style: const TextStyle(color: Colors.grey),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => context.go(AppRoutes.dashboard),
                child: const Text('ダッシュボードに戻る'),
              ),
            ],
          ),
        ),
      );
    },
  );
});