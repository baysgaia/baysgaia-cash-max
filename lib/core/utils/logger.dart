import 'package:logger/logger.dart';
import 'package:flutter/foundation.dart';

/// アプリケーション用ログ管理クラス
class AppLogger {
  static final Logger _logger = Logger(
    printer: PrettyPrinter(
      methodCount: kDebugMode ? 2 : 0,
      errorMethodCount: 5,
      lineLength: 80,
      colors: true,
      printEmojis: true,
      printTime: true,
    ),
    output: kDebugMode ? ConsoleOutput() : null,
  );
  
  /// デバッグログ
  static void debug(String message, [dynamic error, StackTrace? stackTrace]) {
    if (kDebugMode) {
      _logger.d('[DEBUG] $message', error: error, stackTrace: stackTrace);
    }
  }
  
  /// 情報ログ
  static void info(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.i('[INFO] $message', error: error, stackTrace: stackTrace);
  }
  
  /// 警告ログ
  static void warning(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.w('[WARNING] $message', error: error, stackTrace: stackTrace);
  }
  
  /// エラーログ
  static void error(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.e('[ERROR] $message', error: error, stackTrace: stackTrace);
    
    // 本番環境では外部ログサービス（Firebase Crashlytics等）に送信
    if (kReleaseMode && error != null) {
      // TODO: 外部ログサービス連携
      // FirebaseCrashlytics.instance.recordError(error, stackTrace);
    }
  }
  
  /// 致命的エラーログ
  static void fatal(String message, [dynamic error, StackTrace? stackTrace]) {
    _logger.f('[FATAL] $message', error: error, stackTrace: stackTrace);
    
    // 致命的エラーは必ず外部に送信
    if (error != null) {
      // TODO: 外部ログサービス連携
      // FirebaseCrashlytics.instance.recordError(error, stackTrace);
    }
  }
  
  /// APIコール用ログ
  static void apiCall(String method, String url, {
    Map<String, dynamic>? params,
    int? statusCode,
    Duration? duration,
  }) {
    final details = <String>[];
    if (params != null) details.add('params: $params');
    if (statusCode != null) details.add('status: $statusCode');
    if (duration != null) details.add('duration: ${duration.inMilliseconds}ms');
    
    final detailsStr = details.isNotEmpty ? ' (${details.join(', ')})' : '';
    info('API $method $url$detailsStr');
  }
  
  /// ページ遷移ログ
  static void navigation(String from, String to) {
    info('Navigation: $from → $to');
  }
  
  /// ユーザーアクション用ログ
  static void userAction(String action, {Map<String, dynamic>? properties}) {
    final propsStr = properties != null ? ' $properties' : '';
    info('UserAction: $action$propsStr');
  }
  
  /// パフォーマンス計測用ログ
  static void performance(String operation, Duration duration) {
    if (duration.inMilliseconds > 1000) {
      warning('Performance: $operation took ${duration.inMilliseconds}ms (slow)');
    } else {
      debug('Performance: $operation took ${duration.inMilliseconds}ms');
    }
  }
  
  /// ビジネスイベントログ（KPI達成、アラート等）
  static void businessEvent(String event, {Map<String, dynamic>? data}) {
    final dataStr = data != null ? ' $data' : '';
    info('BusinessEvent: $event$dataStr');
  }
  
  /// セキュリティ関連ログ
  static void security(String event, {Map<String, dynamic>? data}) {
    final dataStr = data != null ? ' $data' : '';
    warning('Security: $event$dataStr');
  }
}

/// パフォーマンス測定用ストップウォッチ
class PerformanceTimer {
  final String _operation;
  final Stopwatch _stopwatch = Stopwatch();
  
  PerformanceTimer(this._operation) {
    _stopwatch.start();
  }
  
  void stop() {
    _stopwatch.stop();
    AppLogger.performance(_operation, _stopwatch.elapsed);
  }
}

/// パフォーマンス測定用拡張メソッド
extension FuturePerformance<T> on Future<T> {
  Future<T> measurePerformance(String operation) async {
    final timer = PerformanceTimer(operation);
    try {
      final result = await this;
      timer.stop();
      return result;
    } catch (e) {
      timer.stop();
      rethrow;
    }
  }
}