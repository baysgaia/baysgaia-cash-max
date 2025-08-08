/// BAYSGAiA財務改革システムの定数定義
class AppConstants {
  // アプリケーション基本情報
  static const String appName = 'BAYSGAiA 現金残高最大化システム';
  static const String appVersion = '1.0.0';
  static const String companyName = 'BAYSGAiA（株式会社ベイスガイア）';
  static const String projectName = '現金残高最大化プロジェクト';
  
  // プロジェクト期間
  static const String projectStartDate = '2025-08-01';
  static const String projectEndDate = '2025-12-31';
  
  // OKR目標値
  static const double targetCashGrowth = 0.20; // 20%
  static const double targetCCCReduction = -0.25; // -25%
  static const double targetDSOReduction = -0.30; // -30%
  static const double targetForecastAccuracy = 0.95; // 95%
  static const double targetAutomationRate = 0.70; // 70%
  
  // アラート閾値
  static const double criticalCashBalance = 3000000; // 300万円
  static const double warningCashBalance = 5000000; // 500万円
  static const double criticalForecastAccuracy = 0.90; // 90%
  
  // API設定
  static const String apiBaseUrl = 'https://api.baysgaia.com';
  static const String gmoAozoraApiUrl = 'https://api.gmo-aozora.com/ganb/api/personal/v1';
  static const Duration apiTimeout = Duration(seconds: 30);
  
  // ローカルストレージキー
  static const String userTokenKey = 'user_token';
  static const String userPreferencesKey = 'user_preferences';
  static const String dashboardCacheKey = 'dashboard_cache';
  static const String kpiCacheKey = 'kpi_cache';
  
  // 画面サイズ
  static const double mobileBreakpoint = 768;
  static const double tabletBreakpoint = 1024;
  static const double desktopBreakpoint = 1440;
  
  // アニメーション時間
  static const Duration shortAnimationDuration = Duration(milliseconds: 200);
  static const Duration mediumAnimationDuration = Duration(milliseconds: 400);
  static const Duration longAnimationDuration = Duration(milliseconds: 800);
  
  // リフレッシュ間隔
  static const Duration dashboardRefreshInterval = Duration(minutes: 5);
  static const Duration kpiRefreshInterval = Duration(minutes: 15);
  static const Duration bankDataRefreshInterval = Duration(hours: 1);
  
  // フェーズ定義
  static const Map<int, String> projectPhases = {
    1: 'Phase 1: 基盤構築',
    2: 'Phase 2: システム導入',
    3: 'Phase 3: プロセス変革',
    4: 'Phase 4: 最適化＆拡張',
  };
  
  static const int currentPhase = 2;
  
  // 会議情報
  static const String weeklyMeetingSchedule = '毎週土曜日 8:00';
  static const List<String> meetingParticipants = ['CEO', '相談役'];
  
  // 通知設定
  static const String criticalAlertChannel = 'critical_alerts';
  static const String warningAlertChannel = 'warning_alerts';
  static const String infoAlertChannel = 'info_alerts';
}

/// エラーメッセージ定数
class ErrorMessages {
  static const String networkError = 'ネットワークエラーが発生しました';
  static const String apiError = 'APIエラーが発生しました';
  static const String authError = '認証エラーが発生しました';
  static const String dataError = 'データの取得に失敗しました';
  static const String validationError = '入力内容に問題があります';
  static const String unknownError = '不明なエラーが発生しました';
}

/// 成功メッセージ定数
class SuccessMessages {
  static const String dataUpdated = 'データが更新されました';
  static const String dataSaved = 'データが保存されました';
  static const String loginSuccess = 'ログインしました';
  static const String logoutSuccess = 'ログアウトしました';
  static const String alertResolved = 'アラートを解決しました';
}