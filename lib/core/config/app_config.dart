import 'package:flutter/foundation.dart';

/// アプリケーション設定クラス
class AppConfig {
  // === API設定 ===
  
  /// APIベースURL
  static String get apiBaseUrl {
    if (kDebugMode) {
      return 'https://api-dev.baysgaia.com';
    } else {
      return 'https://api.baysgaia.com';
    }
  }

  /// API接続タイムアウト（秒）
  static const int apiTimeout = 30;

  /// GMOあおぞらネット銀行API設定
  static String get gmoApiBaseUrl {
    if (kDebugMode) {
      return 'https://api.sandbox.aozorabank.co.jp';
    } else {
      return 'https://api.aozorabank.co.jp';
    }
  }

  static String get gmoClientId {
    if (kDebugMode) {
      return const String.fromEnvironment('GMO_CLIENT_ID_DEV', defaultValue: 'demo-client-id');
    } else {
      return const String.fromEnvironment('GMO_CLIENT_ID', defaultValue: '');
    }
  }

  static String get gmoClientSecret {
    if (kDebugMode) {
      return const String.fromEnvironment('GMO_CLIENT_SECRET_DEV', defaultValue: 'demo-client-secret');
    } else {
      return const String.fromEnvironment('GMO_CLIENT_SECRET', defaultValue: '');
    }
  }

  // === アプリ情報 ===
  
  static const String appName = 'BAYSGAiA 財務改革システム';
  static const String appVersion = '1.0.0';
  static const String appBuildNumber = '1';

  /// プロジェクト情報
  static const String projectName = '現金残高最大化プロジェクト';
  static const String companyName = 'BAYSGAiA';
  static const String companyFullName = '株式会社ベイスガイア';

  // === OKR目標値 ===
  
  static const double targetCashGrowth = 0.20; // 20%増加
  static const double targetCCCReduction = -0.25; // 25%削減
  static const double targetDSOReduction = -0.30; // 30%削減
  static const double targetForecastAccuracy = 0.95; // 95%精度
  static const double targetProcessAutomation = 0.70; // 70%自動化

  // === 財務指標設定 ===
  
  /// アラート閾値
  static const double cashBalanceAlertThreshold = 0.05; // 5%以上の変動でアラート
  static const double kpiAlertThreshold = 0.10; // 10%以上の悪化でアラート
  static const int forecastHorizonDays = 90; // 90日間の予測

  /// データ更新間隔
  static const Duration realTimeUpdateInterval = Duration(minutes: 5);
  static const Duration dashboardUpdateInterval = Duration(minutes: 15);
  static const Duration kpiUpdateInterval = Duration(hours: 1);

  // === キャッシュ設定 ===
  
  static const Duration cacheExpiryShort = Duration(minutes: 5);
  static const Duration cacheExpiryMedium = Duration(minutes: 30);
  static const Duration cacheExpiryLong = Duration(hours: 24);

  // === セキュリティ設定 ===
  
  /// セッション期限
  static const Duration sessionTimeout = Duration(hours: 8);
  static const Duration refreshTokenLifetime = Duration(days: 7);

  /// パスワード要件
  static const int minPasswordLength = 8;
  static const bool requirePasswordSpecialChars = true;
  static const bool requirePasswordNumbers = true;

  // === Phase管理 ===
  
  /// 現在のプロジェクトフェーズ
  static ProjectPhase get currentPhase => ProjectPhase.phase2;

  /// プロジェクト開始日
  static DateTime get projectStartDate => DateTime(2025, 8, 7);

  /// プロジェクト終了予定日
  static DateTime get projectEndDate => DateTime(2025, 12, 31);

  // === 補助金・融資情報 ===
  
  /// IT導入補助金申請期限
  static DateTime get itSubsidyDeadline => DateTime(2025, 9, 22);

  /// 日本政策金融公庫融資目標額
  static const double jfcLoanTarget = 5000000; // 500万円

  /// 東京都DX推進助成金目標額  
  static const double tokyoDxGrantTarget = 30000000; // 3,000万円

  // === ログ設定 ===
  
  static bool get enableDetailedLogging => kDebugMode;
  static bool get enableApiLogging => kDebugMode;
  static bool get enablePerformanceLogging => kDebugMode;

  // === フィーチャーフラグ ===
  
  /// 新機能の有効化フラグ
  static bool get enableAdvancedAnalytics => kDebugMode || currentPhase.index >= ProjectPhase.phase3.index;
  static bool get enableRealTimeNotifications => true;
  static bool get enableOfflineMode => false; // 将来実装予定
  static bool get enableDataExport => true;
  static bool get enableUserManagement => currentPhase.index >= ProjectPhase.phase3.index;

  // === 外部サービス設定 ===
  
  /// 通知サービス（Firebase）
  static String get firebaseProjectId => 'baysgaia-cash-max';
  
  /// 分析サービス
  static bool get enableAnalytics => !kDebugMode;

  // === リスク管理設定 ===
  
  /// リスクモニタリング頻度
  static const Duration riskCheckInterval = Duration(hours: 6);
  
  /// 早期警戒指標閾値
  static const double ewiCriticalThreshold = 0.80;
  static const double ewiWarningThreshold = 0.60;

  // === CEO週次レビュー設定 ===
  
  /// レビュー実施日時
  static const int weeklyReviewDayOfWeek = 6; // 土曜日
  static const int weeklyReviewHour = 8; // 8:00

  /// レビュー参加者
  static const List<String> reviewParticipants = [
    'CEO（籾倉丸紀）',
    '相談役',
  ];
}

/// プロジェクトフェーズ列挙
enum ProjectPhase {
  phase1('Phase 1: 基盤構築', 'Week 0-3'),
  phase2('Phase 2: システム導入', 'Week 4-7'),
  phase3('Phase 3: プロセス変革', 'Week 8-11'),
  phase4('Phase 4: 最適化＆拡張', 'Week 12-16');

  const ProjectPhase(this.title, this.period);

  final String title;
  final String period;

  /// フェーズの進行度（0.0-1.0）
  double get progress {
    final startDate = AppConfig.projectStartDate;
    final totalDuration = AppConfig.projectEndDate.difference(startDate).inDays;
    final currentDuration = DateTime.now().difference(startDate).inDays;
    
    return (currentDuration / totalDuration).clamp(0.0, 1.0);
  }

  /// フェーズが完了しているか
  bool get isCompleted {
    return AppConfig.currentPhase.index > index;
  }

  /// 現在のフェーズか
  bool get isCurrent {
    return AppConfig.currentPhase == this;
  }

  /// 将来のフェーズか
  bool get isFuture {
    return AppConfig.currentPhase.index < index;
  }
}

/// 環境タイプ
enum EnvironmentType {
  development,
  staging,
  production;

  static EnvironmentType get current {
    if (kDebugMode) {
      return EnvironmentType.development;
    } else {
      const env = String.fromEnvironment('ENVIRONMENT', defaultValue: 'production');
      return EnvironmentType.values.firstWhere(
        (e) => e.name == env,
        orElse: () => EnvironmentType.production,
      );
    }
  }

  bool get isDevelopment => this == EnvironmentType.development;
  bool get isStaging => this == EnvironmentType.staging;
  bool get isProduction => this == EnvironmentType.production;
}