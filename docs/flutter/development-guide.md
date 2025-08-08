# Flutter開発ガイド

## 概要

BAYSGAiA財務改革システムのFlutter開発における標準的な手順、コーディング規約、ベストプラクティスを定義します。

## 開発環境セットアップ

### 必要なツール

```bash
# Flutter SDKバージョン確認
flutter --version
# Flutter 3.10.0以上であることを確認

# 開発環境診断
flutter doctor -v

# 必要に応じてツールのインストール・更新
flutter upgrade
```

### IDE設定

#### VS Code推奨拡張機能
```json
{
  "recommendations": [
    "dart-code.dart-code",
    "dart-code.flutter",
    "alexisvt.flutter-snippets",
    "jeroen-meijer.pubspec-assist",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

#### Android Studio設定
- Flutter Plugin有効化
- Dart Plugin有効化
- Code Style: Dart official

### プロジェクト初期化

```bash
# 依存関係取得
flutter pub get

# コード生成（初回のみ）
flutter packages pub run build_runner build --delete-conflicting-outputs

# プロジェクト解析
flutter analyze

# テスト実行
flutter test
```

## コーディング規約

### ファイル・ディレクトリ命名規則

```
# ファイル命名: snake_case
dashboard_page.dart
kpi_service.dart
cash_balance_chart.dart

# クラス命名: PascalCase
class DashboardPage
class KpiService
class CashBalanceChart

# 変数・メソッド命名: camelCase
final userName = '';
void calculateTotal() {}

# 定数命名: UPPER_SNAKE_CASE
const API_BASE_URL = '';
```

### インポート順序

```dart
// 1. Dart標準ライブラリ
import 'dart:async';
import 'dart:convert';

// 2. Flutter関連
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

// 3. サードパーティパッケージ
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

// 4. 内部パッケージ（相対パス禁止）
import 'package:baysgaia_cash_max/core/constants/app_constants.dart';
import 'package:baysgaia_cash_max/shared/widgets/loading_widget.dart';
```

### ウィジェット作成規約

```dart
class DashboardPage extends ConsumerWidget {
  /// ダッシュボードページ
  /// 
  /// KPI指標の表示とリアルタイム更新を行う
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 状態取得
    final dashboardState = ref.watch(dashboardProvider);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('ダッシュボード'),
        actions: [
          IconButton(
            onPressed: () => _onRefreshPressed(ref),
            icon: const Icon(Icons.refresh),
            tooltip: 'データを更新',
          ),
        ],
      ),
      body: dashboardState.when(
        loading: () => const LoadingWidget(),
        error: (error, _) => ErrorWidget.withDetails(
          message: 'データの読み込みに失敗しました',
          error: error,
        ),
        data: (data) => _buildDashboardContent(context, data),
      ),
    );
  }

  Widget _buildDashboardContent(BuildContext context, DashboardData data) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildKpiCards(data.kpis),
          const SizedBox(height: 20),
          _buildChartSection(data.chartData),
        ],
      ),
    );
  }

  void _onRefreshPressed(WidgetRef ref) {
    ref.read(dashboardProvider.notifier).refresh();
  }
}
```

### 状態管理規約（Riverpod）

```dart
// 1. State定義（Freezedを使用）
@freezed
class DashboardState with _$DashboardState {
  const factory DashboardState({
    required bool isLoading,
    required List<KpiData> kpis,
    String? errorMessage,
    @Default([]) List<ChartData> chartData,
  }) = _DashboardState;
}

// 2. Notifier実装
class DashboardNotifier extends StateNotifier<AsyncValue<DashboardState>> {
  DashboardNotifier(this._repository) : super(const AsyncValue.loading());

  final DashboardRepository _repository;

  /// ダッシュボードデータを読み込み
  Future<void> loadData() async {
    state = const AsyncValue.loading();
    
    try {
      final kpis = await _repository.getKpis();
      final chartData = await _repository.getChartData();
      
      state = AsyncValue.data(DashboardState(
        isLoading: false,
        kpis: kpis,
        chartData: chartData,
      ));
    } catch (error, stackTrace) {
      AppLogger.error('ダッシュボードデータ読み込みエラー', error, stackTrace);
      state = AsyncValue.error(error, stackTrace);
    }
  }

  /// データを更新
  Future<void> refresh() async {
    await loadData();
  }
}

// 3. Provider定義
final dashboardProvider = StateNotifierProvider<DashboardNotifier, AsyncValue<DashboardState>>((ref) {
  final repository = ref.watch(dashboardRepositoryProvider);
  return DashboardNotifier(repository);
});
```

## API通信実装

### Repository パターン

```dart
// 1. Repository Interface
abstract class DashboardRepository {
  Future<List<KpiData>> getKpis();
  Future<List<ChartData>> getChartData();
  Future<void> updateKpi(String kpiId, double value);
}

// 2. Repository Implementation
class DashboardRepositoryImpl implements DashboardRepository {
  const DashboardRepositoryImpl({
    required this.apiDataSource,
    required this.cacheDataSource,
  });

  final DashboardApiDataSource apiDataSource;
  final DashboardCacheDataSource cacheDataSource;

  @override
  Future<List<KpiData>> getKpis() async {
    try {
      // キャッシュ確認
      final cached = await cacheDataSource.getKpis();
      if (cached != null && !_isCacheExpired(cached)) {
        return cached.map((e) => e.toEntity()).toList();
      }

      // API取得
      final apiData = await apiDataSource.getKpis();
      
      // キャッシュ保存
      await cacheDataSource.saveKpis(apiData);
      
      return apiData.map((e) => e.toEntity()).toList();
    } catch (e) {
      AppLogger.error('KPIデータ取得エラー', e);
      rethrow;
    }
  }

  bool _isCacheExpired(List<KpiDataModel> cached) {
    // キャッシュ期限チェックロジック
    return false; // 簡略化
  }
}

// 3. DataSource Implementation
class DashboardApiDataSource {
  const DashboardApiDataSource(this._apiService);

  final ApiService _apiService;

  Future<List<KpiDataModel>> getKpis() async {
    final response = await _apiService.get('/api/kpis');
    return (response['data'] as List)
        .map((json) => KpiDataModel.fromJson(json))
        .toList();
  }
}
```

### エラーハンドリング

```dart
class ApiException implements Exception {
  const ApiException({
    required this.message,
    required this.statusCode,
    this.errors,
  });

  final String message;
  final int statusCode;
  final Map<String, dynamic>? errors;

  @override
  String toString() => 'ApiException: $message (Status: $statusCode)';
}

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    AppLogger.error('API Error', err);
    
    final apiException = switch (err.type) {
      DioExceptionType.connectionTimeout => const ApiException(
        message: 'サーバーへの接続がタイムアウトしました',
        statusCode: 0,
      ),
      DioExceptionType.receiveTimeout => const ApiException(
        message: 'データの受信がタイムアウトしました',
        statusCode: 0,
      ),
      DioExceptionType.badResponse => ApiException(
        message: err.response?.data['message'] ?? 'サーバーエラーが発生しました',
        statusCode: err.response?.statusCode ?? 0,
        errors: err.response?.data['errors'],
      ),
      _ => const ApiException(
        message: 'ネットワークエラーが発生しました',
        statusCode: 0,
      ),
    };
    
    handler.reject(DioException.requestCancelled(
      requestOptions: err.requestOptions,
      reason: apiException,
    ));
  }
}
```

## UI実装ガイドライン

### レスポンシブデザイン実装

```dart
class ResponsiveDashboard extends StatelessWidget {
  const ResponsiveDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (Breakpoints.isDesktop(context)) {
          return _buildDesktopLayout();
        } else if (Breakpoints.isTablet(context)) {
          return _buildTabletLayout();
        } else {
          return _buildMobileLayout();
        }
      },
    );
  }

  Widget _buildDesktopLayout() {
    return Row(
      children: [
        // サイドナビゲーション
        const SizedBox(width: 280, child: SideNavigation()),
        
        // メインコンテンツ
        Expanded(
          child: Column(
            children: [
              const AppBarSection(),
              Expanded(
                child: _buildDashboardGrid(crossAxisCount: 4),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMobileLayout() {
    return Scaffold(
      appBar: AppBar(title: const Text('ダッシュボード')),
      body: _buildDashboardGrid(crossAxisCount: 1),
      bottomNavigationBar: const BottomNavigation(),
    );
  }

  Widget _buildDashboardGrid({required int crossAxisCount}) {
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        mainAxisSpacing: 16,
        crossAxisSpacing: 16,
        childAspectRatio: 1.5,
      ),
      itemBuilder: (context, index) => const KpiCard(),
    );
  }
}
```

### チャート実装

```dart
class CashFlowChart extends ConsumerWidget {
  const CashFlowChart({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final chartData = ref.watch(cashFlowChartProvider);
    
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'キャッシュフロー推移',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 16),
            Expanded(
              child: LineChart(
                LineChartData(
                  lineBarsData: [
                    LineChartBarData(
                      spots: chartData.map((data) => FlSpot(
                        data.x.toDouble(),
                        data.y.toDouble(),
                      )).toList(),
                      color: ChartColors.profit,
                      barWidth: 3,
                      belowBarData: BarAreaData(
                        show: true,
                        color: ChartColors.profit.withOpacity(0.1),
                      ),
                    ),
                  ],
                  titlesData: FlTitlesData(
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          return Text(
                            _formatDate(value.toInt()),
                            style: const TextStyle(fontSize: 12),
                          );
                        },
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          return Text(
                            _formatCurrency(value),
                            style: const TextStyle(fontSize: 12),
                          );
                        },
                      ),
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  gridData: const FlGridData(show: true),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(int timestamp) {
    final date = DateTime.fromMillisecondsSinceEpoch(timestamp);
    return DateFormat('MM/dd').format(date);
  }

  String _formatCurrency(double value) {
    return NumberFormat.compact().format(value);
  }
}
```

## テスト実装

### 単体テストの書き方

```dart
// test/features/dashboard/presentation/providers/dashboard_provider_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:baysgaia_cash_max/features/dashboard/domain/repositories/dashboard_repository.dart';
import 'package:baysgaia_cash_max/features/dashboard/presentation/providers/dashboard_provider.dart';

class MockDashboardRepository extends Mock implements DashboardRepository {}

void main() {
  late MockDashboardRepository mockRepository;
  late ProviderContainer container;

  setUp(() {
    mockRepository = MockDashboardRepository();
    container = ProviderContainer(
      overrides: [
        dashboardRepositoryProvider.overrideWithValue(mockRepository),
      ],
    );
  });

  tearDown(() {
    container.dispose();
  });

  group('DashboardProvider', () {
    test('初期状態はloadingである', () {
      final provider = container.read(dashboardProvider);
      expect(provider, isA<AsyncLoading>());
    });

    test('loadData成功時にデータが更新される', () async {
      // Arrange
      final mockData = [TestData.createMockKpiData()];
      when(mockRepository.getKpis()).thenAnswer((_) async => mockData);

      // Act
      await container.read(dashboardProvider.notifier).loadData();

      // Assert
      final state = container.read(dashboardProvider);
      expect(state, isA<AsyncData<DashboardState>>());
      expect(state.value?.kpis, mockData);
    });

    test('loadDataエラー時にエラー状態になる', () async {
      // Arrange
      final exception = Exception('Network error');
      when(mockRepository.getKpis()).thenThrow(exception);

      // Act
      await container.read(dashboardProvider.notifier).loadData();

      // Assert
      final state = container.read(dashboardProvider);
      expect(state, isA<AsyncError>());
      expect(state.error, exception);
    });
  });
}
```

### ウィジェットテスト

```dart
// test/features/dashboard/presentation/pages/dashboard_page_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mockito/mockito.dart';

import 'package:baysgaia_cash_max/features/dashboard/presentation/pages/dashboard_page.dart';

void main() {
  late MockDashboardRepository mockRepository;

  setUp(() {
    mockRepository = MockDashboardRepository();
  });

  Widget createTestWidget() {
    return ProviderScope(
      overrides: [
        dashboardRepositoryProvider.overrideWithValue(mockRepository),
      ],
      child: const MaterialApp(
        home: DashboardPage(),
      ),
    );
  }

  group('DashboardPage', () {
    testWidgets('ローディング状態が表示される', (WidgetTester tester) async {
      // Arrange
      when(mockRepository.getKpis()).thenAnswer((_) async {
        await Future.delayed(const Duration(seconds: 1));
        return [];
      });

      // Act
      await tester.pumpWidget(createTestWidget());

      // Assert
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('データ表示時にKPIカードが表示される', (WidgetTester tester) async {
      // Arrange
      final mockData = [TestData.createMockKpiData()];
      when(mockRepository.getKpis()).thenAnswer((_) async => mockData);

      // Act
      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      // Assert
      expect(find.byType(KpiCard), findsWidgets);
      expect(find.text('現金残高改善率'), findsOneWidget);
    });

    testWidgets('更新ボタンタップでデータが再読み込みされる', (WidgetTester tester) async {
      // Arrange
      when(mockRepository.getKpis()).thenAnswer((_) async => []);

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      // Act
      await tester.tap(find.byIcon(Icons.refresh));
      await tester.pumpAndSettle();

      // Assert
      verify(mockRepository.getKpis()).called(2); // 初期読み込み + 更新
    });
  });
}
```

## デバッグとパフォーマンス

### デバッグテクニック

```dart
// デバッグ情報付きログ
void debugPrintWithContext(String message, [Object? error]) {
  if (kDebugMode) {
    final stackTrace = StackTrace.current;
    final frame = stackTrace.toString().split('\n')[1];
    print('[$frame] $message');
    if (error != null) {
      print('Error: $error');
    }
  }
}

// パフォーマンス計測
T measurePerformance<T>(String operation, T Function() action) {
  final stopwatch = Stopwatch()..start();
  try {
    final result = action();
    return result;
  } finally {
    stopwatch.stop();
    AppLogger.performance(operation, stopwatch.elapsed);
  }
}
```

### Flutter Inspector活用

```bash
# Flutter Inspector起動
flutter run --debug
# デバッガーでブレークポイント設定
# Widget Inspector で UI 構造確認
# Performance タブでフレームレート確認
```

## リリース準備

### ビルド設定

```yaml
# android/app/build.gradle
android {
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### セキュリティチェック

```bash
# セキュリティ監査
flutter analyze
dart analyze --fatal-infos

# 依存関係脆弱性チェック
dart pub audit
```

### リリースビルド

```bash
# Android
flutter build apk --release --target-platform android-arm64
flutter build appbundle --release

# iOS
flutter build ios --release
flutter build ipa --release

# Web
flutter build web --release

# Desktop
flutter build windows --release
flutter build macos --release
```

## 今後の改善計画

### コード品質向上
- より厳密な型定義
- 自動テストカバレッジ向上
- 静的解析ルール強化

### 開発効率化
- コード生成自動化
- CI/CD パイプライン構築
- 開発ドキュメント整備