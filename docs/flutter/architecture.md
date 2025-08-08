# Flutter アーキテクチャ設計書

## 概要

BAYSGAiA財務改革システムのFlutterアプリケーションアーキテクチャ設計を定義します。Clean Architecture + MVVMパターンを採用し、保守性と拡張性を重視した設計としています。

## アーキテクチャ概要

### レイヤー構造

```
┌─────────────────────────────────────┐
│           Presentation Layer        │  UI・状態管理・ルーティング
├─────────────────────────────────────┤
│            Domain Layer             │  ビジネスロジック・エンティティ
├─────────────────────────────────────┤
│             Data Layer              │  API・データベース・キャッシュ
└─────────────────────────────────────┘
```

### 主要コンポーネント

1. **Presentation Layer**
   - Widgets (UI Components)
   - Pages (Screen Components)
   - Providers (State Management)
   - ViewModels (Business Logic)

2. **Domain Layer**
   - Entities (Business Objects)
   - Use Cases (Business Operations)
   - Repository Interfaces

3. **Data Layer**
   - API Services
   - Local Storage
   - Repository Implementations
   - Data Models

## ディレクトリ構造

```
lib/
├── app/                              # アプリケーション設定
│   ├── app.dart                      # メインアプリウィジェット
│   └── router/
│       └── app_router.dart           # ルーティング設定
│
├── core/                             # コア機能
│   ├── constants/
│   │   └── app_constants.dart        # アプリ定数
│   ├── theme/
│   │   └── app_theme.dart            # テーマ設定
│   ├── services/
│   │   ├── storage_service.dart      # ストレージサービス
│   │   ├── api_service.dart          # API基盤サービス
│   │   └── notification_service.dart # 通知サービス
│   ├── utils/
│   │   ├── logger.dart               # ログ管理
│   │   ├── validators.dart           # バリデーション
│   │   └── formatters.dart           # フォーマッタ
│   └── config/
│       └── app_config.dart           # アプリ設定
│
├── features/                         # 機能別実装（Feature-First）
│   ├── auth/
│   │   ├── data/
│   │   │   ├── datasources/          # データソース
│   │   │   ├── models/               # データモデル
│   │   │   └── repositories/         # リポジトリ実装
│   │   ├── domain/
│   │   │   ├── entities/             # エンティティ
│   │   │   ├── repositories/         # リポジトリインターfaces
│   │   │   └── usecases/             # ユースケース
│   │   └── presentation/
│   │       ├── pages/                # ページウィジェット
│   │       ├── widgets/              # 機能固有ウィジェット
│   │       └── providers/            # 状態管理プロバイダー
│   │
│   ├── dashboard/
│   ├── kpi/
│   ├── cashflow/
│   ├── subsidy/
│   ├── process/
│   ├── risk/
│   ├── project/
│   └── settings/
│
└── shared/                           # 共通コンポーネント
    ├── widgets/                      # 共通ウィジェット
    │   ├── buttons/
    │   ├── cards/
    │   ├── charts/
    │   ├── forms/
    │   └── layouts/
    ├── models/                       # 共通データモデル
    └── providers/                    # 共通プロバイダー
```

## 状態管理（Riverpod）

### Provider設計パターン

```dart
// 1. 状態クラス定義
@freezed
class DashboardState with _$DashboardState {
  const factory DashboardState({
    required bool isLoading,
    required List<KpiData> kpis,
    String? error,
  }) = _DashboardState;
}

// 2. Notifier実装
class DashboardNotifier extends StateNotifier<DashboardState> {
  DashboardNotifier(this._repository) : super(
    const DashboardState(isLoading: false, kpis: [])
  );

  final DashboardRepository _repository;

  Future<void> loadDashboardData() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final kpis = await _repository.getKpiData();
      state = state.copyWith(isLoading: false, kpis: kpis);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}

// 3. Provider定義
final dashboardProvider = StateNotifierProvider<DashboardNotifier, DashboardState>((ref) {
  final repository = ref.watch(dashboardRepositoryProvider);
  return DashboardNotifier(repository);
});
```

### Provider階層構造

```
GlobalProviders (app/providers/)
├── AuthProvider
├── ConfigProvider
└── ThemeProvider

FeatureProviders (features/{feature}/providers/)
├── DashboardProvider
├── KpiProvider
├── CashflowProvider
└── ...

RepositoryProviders (features/{feature}/data/repositories/)
├── DashboardRepositoryProvider
├── ApiServiceProvider
└── StorageServiceProvider
```

## データフロー

### API通信フロー

```
UI Widget
    ↓ user action
Provider/Notifier
    ↓ call usecase
UseCase
    ↓ call repository
Repository
    ↓ call datasource
API Service
    ↓ HTTP request
GMOあおぞらネット銀行API
    ↓ response
API Service
    ↓ parse to model
Repository
    ↓ convert to entity
UseCase
    ↓ update state
Provider/Notifier
    ↓ notify change
UI Widget (rebuild)
```

### キャッシュ戦略

```dart
class CachedRepository implements DashboardRepository {
  final ApiDataSource _apiDataSource;
  final CacheDataSource _cacheDataSource;

  @override
  Future<List<KpiData>> getKpiData() async {
    // 1. キャッシュから取得試行
    final cached = await _cacheDataSource.getKpiData();
    if (cached != null && !_isCacheExpired(cached)) {
      return cached.data;
    }

    // 2. APIから取得
    final fresh = await _apiDataSource.getKpiData();
    
    // 3. キャッシュに保存
    await _cacheDataSource.saveKpiData(fresh);
    
    return fresh;
  }
}
```

## 画面設計

### レスポンシブデザイン

```dart
class ResponsiveLayout extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;

  const ResponsiveLayout({
    Key? key,
    required this.mobile,
    this.tablet,
    this.desktop,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= Breakpoints.desktop) {
          return desktop ?? tablet ?? mobile;
        } else if (constraints.maxWidth >= Breakpoints.tablet) {
          return tablet ?? mobile;
        } else {
          return mobile;
        }
      },
    );
  }
}
```

### ナビゲーション設計

```dart
// Bottom Navigation (Mobile)
class MobileBottomNavigation extends StatelessWidget {
  final List<NavigationItem> items = [
    NavigationItem(icon: Icons.dashboard, label: 'ダッシュボード', route: '/'),
    NavigationItem(icon: Icons.analytics, label: 'KPI', route: '/kpi-details'),
    NavigationItem(icon: Icons.account_balance_wallet, label: 'キャッシュフロー', route: '/cashflow'),
    NavigationItem(icon: Icons.monetization_on, label: '補助金', route: '/subsidy'),
    NavigationItem(icon: Icons.settings, label: '設定', route: '/settings'),
  ];
}

// Side Navigation (Desktop/Tablet)
class DesktopSideNavigation extends StatelessWidget {
  final List<NavigationGroup> groups = [
    NavigationGroup(
      title: '主要機能',
      items: [
        NavigationItem(icon: Icons.dashboard, label: 'ダッシュボード', route: '/'),
        NavigationItem(icon: Icons.analytics, label: 'KPI詳細', route: '/kpi-details'),
        NavigationItem(icon: Icons.account_balance_wallet, label: 'キャッシュフロー', route: '/cashflow'),
      ],
    ),
    NavigationGroup(
      title: '管理機能',
      items: [
        NavigationItem(icon: Icons.monetization_on, label: '補助金・融資', route: '/subsidy'),
        NavigationItem(icon: Icons.settings, label: 'プロセス管理', route: '/process'),
        NavigationItem(icon: Icons.warning, label: 'リスク管理', route: '/risk'),
      ],
    ),
  ];
}
```

## API設計

### 統一API基盤

```dart
class ApiService {
  final Dio _dio;
  
  ApiService() : _dio = Dio() {
    _dio.options.baseUrl = AppConfig.apiBaseUrl;
    _dio.options.connectTimeout = AppConfig.apiTimeout;
    
    // インターセプター設定
    _dio.interceptors.add(AuthInterceptor());
    _dio.interceptors.add(LoggingInterceptor());
    _dio.interceptors.add(ErrorInterceptor());
  }

  // 共通GETメソッド
  Future<T> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    T Function(Map<String, dynamic>)? fromJson,
  }) async {
    try {
      final response = await _dio.get(path, queryParameters: queryParameters);
      if (fromJson != null) {
        return fromJson(response.data);
      }
      return response.data;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }
}
```

### GMOあおぞら銀行API連携

```dart
class GmoAozoraApiService {
  final ApiService _apiService;

  GmoAozoraApiService(this._apiService);

  // OAuth2.0認証
  Future<AuthToken> authenticate(String code) async {
    return await _apiService.post(
      '/auth/token',
      data: {
        'grant_type': 'authorization_code',
        'code': code,
        'client_id': AppConfig.gmoClientId,
        'client_secret': AppConfig.gmoClientSecret,
      },
      fromJson: (json) => AuthToken.fromJson(json),
    );
  }

  // 残高照会
  Future<AccountBalance> getBalance() async {
    return await _apiService.get(
      '/accounts/balance',
      fromJson: (json) => AccountBalance.fromJson(json),
    );
  }

  // 取引履歴
  Future<List<Transaction>> getTransactions({
    DateTime? from,
    DateTime? to,
    int limit = 100,
  }) async {
    return await _apiService.get(
      '/accounts/transactions',
      queryParameters: {
        if (from != null) 'from': from.toIso8601String(),
        if (to != null) 'to': to.toIso8601String(),
        'limit': limit,
      },
      fromJson: (json) => (json['transactions'] as List)
          .map((item) => Transaction.fromJson(item))
          .toList(),
    );
  }
}
```

## テスト設計

### テスト構造

```
test/
├── unit/                           # 単体テスト
│   ├── core/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   └── dashboard/
│   └── shared/
├── widget/                         # ウィジェットテスト
│   ├── features/
│   └── shared/
├── integration/                    # 統合テスト
│   ├── app_test.dart
│   ├── dashboard_flow_test.dart
│   └── api_integration_test.dart
└── test_utils/                     # テストユーティリティ
    ├── mock_data.dart
    ├── test_helpers.dart
    └── golden_test_helper.dart
```

### テスト例

```dart
// Unit Test例
class MockDashboardRepository extends Mock implements DashboardRepository {}

void main() {
  group('DashboardNotifier', () {
    late MockDashboardRepository mockRepository;
    late DashboardNotifier notifier;

    setUp(() {
      mockRepository = MockDashboardRepository();
      notifier = DashboardNotifier(mockRepository);
    });

    test('初期状態が正しく設定される', () {
      expect(notifier.state.isLoading, false);
      expect(notifier.state.kpis, isEmpty);
      expect(notifier.state.error, null);
    });

    test('loadDashboardData が成功時に状態を更新する', () async {
      // Arrange
      final mockKpis = [TestData.mockKpiData];
      when(() => mockRepository.getKpiData())
          .thenAnswer((_) async => mockKpis);

      // Act
      await notifier.loadDashboardData();

      // Assert
      expect(notifier.state.isLoading, false);
      expect(notifier.state.kpis, mockKpis);
      expect(notifier.state.error, null);
    });
  });
}
```

## パフォーマンス最適化

### ビルド最適化

```dart
// const constructorの使用
class KpiCard extends StatelessWidget {
  const KpiCard({
    Key? key,
    required this.title,
    required this.value,
    required this.trend,
  }) : super(key: key);

// メモ化の活用
@override
Widget build(BuildContext context) {
  return Consumer(
    builder: (context, ref, child) {
      final kpiState = ref.watch(kpiProvider);
      
      // 変更されない部分はchildで渡す
      return AnimatedContainer(
        child: child,
        // ... other properties
      );
    },
    child: const ExpensiveWidget(), // 再ビルドされない
  );
}
```

### 画像・アセット最適化

```yaml
# pubspec.yaml
flutter:
  assets:
    - assets/images/2.0x/
    - assets/images/3.0x/
    - assets/icons/
```

```dart
// 効率的な画像読み込み
class OptimizedImage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Image.asset(
      'assets/images/chart_background.png',
      cacheWidth: 300, // キャッシュサイズ指定
      cacheHeight: 200,
    );
  }
}
```

## セキュリティ考慮事項

### データ暗号化

```dart
// センシティブデータの暗号化保存
class SecureStorage {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainItemAccessibility.first_unlock_this_device,
    ),
  );

  static Future<void> storeToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }
}
```

### API通信セキュリティ

```dart
class SecurityInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // SSL Pinning
    options.headers['X-API-Version'] = '1.0';
    
    // リクエスト署名
    final signature = _generateSignature(options);
    options.headers['X-Request-Signature'] = signature;
    
    super.onRequest(options, handler);
  }
}
```

## 今後の拡張計画

### Phase 3 拡張予定
- WebSocket通信によるリアルタイムデータ
- オフライン機能（Drift + Sync）
- 高度な分析機能（ML Kit統合）

### Phase 4 拡張予定
- マルチテナント対応
- 外部API統合拡張
- パフォーマンス分析・監視ダッシュボード