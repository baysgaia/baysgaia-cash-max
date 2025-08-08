import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import '../core/config/app_config.dart';
import '../core/utils/logger.dart';
import '../core/theme/app_theme.dart';
import '../features/auth/providers/auth_provider.dart';
import 'router/app_router.dart';

class BaysGaiaApp extends ConsumerWidget {
  const BaysGaiaApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    
    AppLogger.info('BaysGaiaApp starting - ${AppConfig.appName} v${AppConfig.appVersion}');
    
    return MaterialApp.router(
      title: AppConfig.appName,
      debugShowCheckedModeBanner: false,
      
      // テーマ設定
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light, // TODO: ユーザー設定に基づく切り替え
      
      // 国際化設定
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('ja', 'JP'),
        Locale('en', 'US'),
      ],
      locale: const Locale('ja', 'JP'),
      
      // ルーター設定
      routerConfig: router,
    );
  }
}