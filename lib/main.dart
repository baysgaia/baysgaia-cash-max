import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart';

import 'app/app.dart';
import 'core/config/app_config.dart';
import 'core/services/storage_service.dart';
import 'core/utils/logger.dart';

void main() async {
  // Flutter初期化
  WidgetsFlutterBinding.ensureInitialized();
  
  try {
    // Hive初期化
    await Hive.initFlutter();
    
    // ストレージサービス初期化
    await StorageService.initialize();
    
    // ロケール設定
    Intl.defaultLocale = 'ja_JP';
    
    AppLogger.info('BAYSGAiA財務改革システム - アプリケーション開始');
    
    runApp(
      const ProviderScope(
        child: BaysGaiaApp(),
      ),
    );
  } catch (e, stackTrace) {
    AppLogger.error('アプリケーション初期化エラー', e, stackTrace);
    
    // エラー時のフォールバック画面
    runApp(
      MaterialApp(
        title: AppConfig.appName,
        home: Scaffold(
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error, size: 64, color: Colors.red),
                const SizedBox(height: 16),
                const Text(
                  'アプリケーションの初期化に失敗しました',
                  style: TextStyle(fontSize: 18),
                ),
                const SizedBox(height: 8),
                Text(
                  'エラー: $e',
                  style: const TextStyle(color: Colors.grey),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}