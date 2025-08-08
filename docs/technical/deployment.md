# デプロイメント仕様書

## 概要

BAYSGAiA財務改革システムのFlutterアプリケーションのデプロイメント手順と環境構成を定義します。クロスプラットフォーム対応により、Web、iOS、Android、デスクトップ環境へのデプロイを実現します。

## 環境構成

### 環境一覧

| 環境 | プラットフォーム | URL/配布方法 | 特徴 |
|------|-----------------|--------------|------|
| 開発 | Web | http://localhost:8080 | ホットリロード対応 |
| ステージング | Web | https://stg.cashflow.baysgaia.com | 本番同等構成 |
| 本番 | Web | https://cashflow.baysgaia.com | CDN配信 |
| 本番 | iOS | TestFlight/App Store | Face ID対応 |
| 本番 | Android | Google Play | 指紋認証対応 |

### Flutter環境要件

```yaml
# pubspec.yaml
environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: ">=3.10.0"

# FVM設定（Flutter Version Management）
# .fvm/fvm_config.json
{
  "flutterSdkVersion": "3.16.0",
  "flavors": {}
}
```

## ビルドプロセス

### 自動ビルドパイプライン

```yaml
# .github/workflows/flutter-build.yml
name: Flutter Build and Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          channel: 'stable'
          
      - name: Install dependencies
        run: flutter pub get
        
      - name: Run analyzer
        run: flutter analyze
        
      - name: Run tests
        run: flutter test --coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: coverage/lcov.info

  build-web:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          
      - name: Build Web
        run: |
          flutter build web --release \
            --dart-define=API_BASE_URL=${{ secrets.API_BASE_URL }} \
            --dart-define=GMO_API_URL=${{ secrets.GMO_API_URL }}
            
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: web-build
          path: build/web/

  build-mobile:
    needs: test
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest]
        include:
          - os: macos-latest
            platform: ios
          - os: ubuntu-latest
            platform: android
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          
      - name: Build ${{ matrix.platform }}
        run: flutter build ${{ matrix.platform }} --release
```

### プラットフォーム別ビルド

#### Web版ビルド
```bash
# 開発ビルド
flutter build web --profile \
  --dart-define=ENVIRONMENT=development

# 本番ビルド（最適化）
flutter build web --release \
  --dart-define=ENVIRONMENT=production \
  --web-renderer canvaskit \
  --tree-shake-icons

# PWA対応
flutter build web --release --pwa-strategy=offline-first
```

#### iOS版ビルド
```bash
# TestFlight用ビルド
flutter build ios --release \
  --dart-define=ENVIRONMENT=production

# App Store用アーカイブ
flutter build ipa --release \
  --export-options-plist=ios/ExportOptions.plist
```

#### Android版ビルド
```bash
# APKビルド
flutter build apk --release \
  --dart-define=ENVIRONMENT=production \
  --split-per-abi

# App Bundle（推奨）
flutter build appbundle --release \
  --dart-define=ENVIRONMENT=production
```

## 環境設定

### 環境変数管理

```dart
// lib/core/config/environment.dart
abstract class Environment {
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:5000',
  );
  
  static const String gmoApiUrl = String.fromEnvironment(
    'GMO_API_URL',
    defaultValue: 'https://sandbox.gmo-aozora.com',
  );
  
  static const String environment = String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: 'development',
  );
  
  static bool get isProduction => environment == 'production';
  static bool get isDevelopment => environment == 'development';
  static bool get isStaging => environment == 'staging';
}
```

### セキュアストレージ

```dart
// lib/core/services/secure_config_service.dart
class SecureConfigService {
  static const _storage = FlutterSecureStorage();
  
  // API認証情報の保存
  static Future<void> saveApiCredentials({
    required String clientId,
    required String clientSecret,
  }) async {
    await _storage.write(key: 'gmo_client_id', value: clientId);
    await _storage.write(key: 'gmo_client_secret', value: clientSecret);
  }
  
  // 生体認証設定
  static Future<void> enableBiometrics() async {
    final localAuth = LocalAuthentication();
    final isAvailable = await localAuth.canCheckBiometrics;
    
    if (isAvailable) {
      await _storage.write(
        key: 'biometrics_enabled',
        value: 'true',
        aOptions: const AndroidOptions(
          encryptedSharedPreferences: true,
        ),
        iOptions: const IOSOptions(
          accessibility: IOSAccessibility.unlocked_this_device,
        ),
      );
    }
  }
}
```

## デプロイメント手順

### Web版デプロイ（Firebase Hosting）

```bash
#!/bin/bash
# deploy-web.sh

# 1. ビルド
echo "Building Flutter Web..."
flutter build web --release \
  --dart-define=ENVIRONMENT=production

# 2. 最適化
echo "Optimizing assets..."
# 画像圧縮
find build/web/assets -name "*.png" -exec pngquant --ext .png --force {} \;
find build/web/assets -name "*.jpg" -exec jpegoptim -m85 {} \;

# 3. デプロイ
echo "Deploying to Firebase..."
firebase deploy --only hosting:production

# 4. CDNキャッシュクリア
echo "Purging CDN cache..."
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

echo "Deployment completed!"
```

### iOS版デプロイ（TestFlight）

```bash
#!/bin/bash
# deploy-ios.sh

# 1. 証明書設定
echo "Setting up certificates..."
fastlane match appstore

# 2. ビルド番号更新
BUILD_NUMBER=$(date +%Y%m%d%H%M)
flutter pub run flutter_launcher_icons:main
flutter build ios --release --build-number=$BUILD_NUMBER

# 3. アーカイブとアップロード
cd ios
fastlane beta
```

### Android版デプロイ（Google Play）

```bash
#!/bin/bash
# deploy-android.sh

# 1. 署名設定
echo "Configuring signing..."
cp $KEYSTORE_FILE android/app/keystore.jks

# 2. バージョン更新
VERSION_CODE=$(date +%Y%m%d%H)
flutter build appbundle --release \
  --build-number=$VERSION_CODE

# 3. Play Consoleへアップロード
cd android
fastlane deploy
```

## プラットフォーム別設定

### Web設定

```html
<!-- web/index.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta content="IE=Edge" http-equiv="X-UA-Compatible">
  <meta name="description" content="BAYSGAiA財務改革システム">
  
  <!-- PWA設定 -->
  <link rel="manifest" href="manifest.json">
  <meta name="theme-color" content="#2196F3">
  
  <!-- iOS設定 -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-mobile-web-app-title" content="BAYSGAiA">
  
  <title>BAYSGAiA財務改革システム</title>
  <link rel="icon" type="image/png" href="favicon.png"/>
</head>
<body>
  <script>
    // サービスワーカー登録
    if ('serviceWorker' in navigator) {
      window.addEventListener('flutter-first-frame', function () {
        navigator.serviceWorker.register('flutter_service_worker.js');
      });
    }
  </script>
  <script src="main.dart.js" type="application/javascript"></script>
</body>
</html>
```

### iOS設定

```xml
<!-- ios/Runner/Info.plist -->
<key>NSFaceIDUsageDescription</key>
<string>Face IDを使用して安全にログインします</string>
<key>NSCameraUsageDescription</key>
<string>領収書の撮影に使用します</string>
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>baysgaia</string>
    </array>
  </dict>
</array>
```

### Android設定

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.USE_FINGERPRINT"/>
<uses-permission android:name="android.permission.USE_BIOMETRIC"/>
<uses-permission android:name="android.permission.CAMERA"/>

<application>
  <meta-data
    android:name="com.google.firebase.messaging.default_notification_icon"
    android:resource="@drawable/notification_icon" />
    
  <!-- Deep Link設定 -->
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="baysgaia" />
  </intent-filter>
</application>
```

## 監視とログ

### Firebase Crashlytics統合

```dart
// lib/main.dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Crashlytics初期化
  await Firebase.initializeApp();
  FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
  
  // 非同期エラーキャッチ
  PlatformDispatcher.instance.onError = (error, stack) {
    FirebaseCrashlytics.instance.recordError(error, stack, fatal: true);
    return true;
  };
  
  runApp(const BaysGaiaApp());
}
```

### パフォーマンス監視

```dart
// lib/core/services/performance_service.dart
class PerformanceService {
  static final _performance = FirebasePerformance.instance;
  
  // カスタムトレース
  static Future<T> trace<T>(
    String name,
    Future<T> Function() operation,
  ) async {
    final trace = _performance.newTrace(name);
    await trace.start();
    
    try {
      final result = await operation();
      trace.setMetric('success', 1);
      return result;
    } catch (e) {
      trace.setMetric('error', 1);
      rethrow;
    } finally {
      await trace.stop();
    }
  }
  
  // HTTPメトリクス
  static HttpMetric startHttpMetric(String url, HttpMethod method) {
    return _performance.newHttpMetric(url, method);
  }
}
```

## 災害復旧とバックアップ

### オフライン対応

```dart
// lib/core/services/offline_service.dart
class OfflineService {
  static final _connectivity = Connectivity();
  static final _hive = Hive;
  
  // オフラインデータ同期
  static Future<void> syncOfflineData() async {
    final connectivityResult = await _connectivity.checkConnectivity();
    
    if (connectivityResult != ConnectivityResult.none) {
      final pendingData = await _hive.box('offline_queue').values.toList();
      
      for (final data in pendingData) {
        try {
          await _uploadData(data);
          await _hive.box('offline_queue').delete(data.key);
        } catch (e) {
          AppLogger.error('オフライン同期エラー', e);
        }
      }
    }
  }
}
```

### データバックアップ

```dart
// 自動バックアップ（iCloud/Google Drive）
class BackupService {
  // iOS: iCloud
  static Future<void> backupToICloud() async {
    if (Platform.isIOS) {
      final directory = await getApplicationDocumentsDirectory();
      final backupPath = '${directory.path}/backup';
      
      // iCloudコンテナに保存
      await Process.run('cp', ['-r', backupPath, '~/Library/Mobile Documents/']);
    }
  }
  
  // Android: Google Drive
  static Future<void> backupToGoogleDrive() async {
    if (Platform.isAndroid) {
      // Google Drive API使用
      final googleSignIn = GoogleSignIn(scopes: ['drive.file']);
      final account = await googleSignIn.signIn();
      // バックアップ処理
    }
  }
}
```

## 段階的ロールアウト

### Feature Flags

```dart
// lib/core/services/feature_flag_service.dart
class FeatureFlagService {
  static final _remoteConfig = FirebaseRemoteConfig.instance;
  
  static Future<void> initialize() async {
    await _remoteConfig.setDefaults({
      'enable_ai_prediction': false,
      'enable_biometric_auth': true,
      'max_offline_days': 7,
    });
    
    await _remoteConfig.fetchAndActivate();
  }
  
  static bool get isAiPredictionEnabled =>
      _remoteConfig.getBool('enable_ai_prediction');
      
  static bool get isBiometricAuthEnabled =>
      _remoteConfig.getBool('enable_biometric_auth');
}
```

### A/Bテスト

```dart
// Firebase A/Bテスト統合
class ABTestService {
  static Future<String> getDashboardVariant() async {
    final variant = await FirebaseRemoteConfig.instance
        .getString('dashboard_variant');
    
    // アナリティクスに記録
    await FirebaseAnalytics.instance.logEvent(
      name: 'experiment_exposure',
      parameters: {
        'experiment_name': 'dashboard_redesign',
        'variant': variant,
      },
    );
    
    return variant;
  }
}
```

## チェックリスト

### デプロイ前チェック
- [ ] flutter analyze エラーなし
- [ ] flutter test 全テスト合格
- [ ] ビルド番号・バージョン更新
- [ ] 環境変数設定確認
- [ ] 証明書・署名設定確認

### デプロイ後チェック
- [ ] アプリ起動確認
- [ ] 主要機能動作確認
- [ ] クラッシュレポート確認
- [ ] パフォーマンスメトリクス確認
- [ ] ユーザーフィードバック確認

## サポート情報

### ドキュメント
- Flutter開発ガイド: `/docs/flutter/development-guide.md`
- アーキテクチャ: `/docs/technical/architecture.md`
- API仕様: `/docs/api/`

### トラブルシューティング
- ビルドエラー: `flutter clean && flutter pub get`
- 証明書エラー: `fastlane match nuke`
- キャッシュクリア: `flutter pub cache repair`