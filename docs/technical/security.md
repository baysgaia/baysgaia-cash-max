# セキュリティ仕様書

## 概要

BAYSGAiA財務改革システムのFlutterアプリケーションにおけるセキュリティ要件と実装仕様を定義します。金融データを扱うシステムとして、最高水準のセキュリティを確保します。

## セキュリティ原則

1. **最小権限の原則**: 必要最小限のアクセス権限のみ付与
2. **多層防御**: 複数のセキュリティレイヤーで保護
3. **ゼロトラスト**: すべてのアクセスを検証
4. **監査可能性**: 全操作の記録と追跡可能性

## 認証・認可

### 生体認証（Phase 2 - 実装中）

```dart
// lib/features/auth/services/biometric_service.dart
import 'package:local_auth/local_auth.dart';

class BiometricService {
  static final _localAuth = LocalAuthentication();
  
  // 生体認証の可用性チェック
  static Future<BiometricType?> getAvailableBiometric() async {
    if (!await _localAuth.canCheckBiometrics) {
      return null;
    }
    
    final availableBiometrics = await _localAuth.getAvailableBiometrics();
    
    if (Platform.isIOS) {
      if (availableBiometrics.contains(BiometricType.face)) {
        return BiometricType.face; // Face ID
      }
      if (availableBiometrics.contains(BiometricType.fingerprint)) {
        return BiometricType.fingerprint; // Touch ID
      }
    } else if (Platform.isAndroid) {
      if (availableBiometrics.contains(BiometricType.fingerprint)) {
        return BiometricType.fingerprint;
      }
    }
    
    return null;
  }
  
  // 生体認証実行
  static Future<bool> authenticate({
    required String reason,
  }) async {
    try {
      return await _localAuth.authenticate(
        localizedReason: reason,
        options: const AuthenticationOptions(
          biometricOnly: true,
          stickyAuth: true,
        ),
      );
    } catch (e) {
      AppLogger.error('生体認証エラー', e);
      return false;
    }
  }
}
```

### JWT認証実装

```dart
// lib/features/auth/services/auth_service.dart
class AuthService {
  static const _storage = FlutterSecureStorage();
  
  // トークン保存（セキュアストレージ）
  static Future<void> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await _storage.write(
      key: 'access_token',
      value: accessToken,
      aOptions: const AndroidOptions(
        encryptedSharedPreferences: true,
      ),
      iOptions: const IOSOptions(
        accessibility: IOSAccessibility.unlocked_this_device,
      ),
    );
    
    await _storage.write(
      key: 'refresh_token',
      value: refreshToken,
      aOptions: const AndroidOptions(
        encryptedSharedPreferences: true,
      ),
      iOptions: const IOSOptions(
        accessibility: IOSAccessibility.unlocked_this_device,
      ),
    );
  }
  
  // トークン検証
  static Future<bool> validateToken(String token) async {
    try {
      final jwt = JWT.decode(token);
      final isExpired = jwt.payload['exp'] < 
          DateTime.now().millisecondsSinceEpoch / 1000;
      return !isExpired;
    } catch (e) {
      return false;
    }
  }
}
```

### 認可モデル

```dart
// lib/features/auth/models/user_role.dart
enum UserRole {
  ceo('CEO'),
  cfo('CFO'),
  advisor('ADVISOR'),
  operator('OPERATOR'),
  viewer('VIEWER');
  
  final String value;
  const UserRole(this.value);
}

// lib/features/auth/models/permission.dart
class Permission {
  final String resource;
  final Set<String> actions;
  
  const Permission({
    required this.resource,
    required this.actions,
  });
}

// 役割別権限定義
final rolePermissions = <UserRole, List<Permission>>{
  UserRole.ceo: [
    Permission(resource: '*', actions: {'create', 'read', 'update', 'delete'}),
  ],
  UserRole.cfo: [
    Permission(resource: 'financial', actions: {'create', 'read', 'update'}),
    Permission(resource: 'reports', actions: {'read'}),
  ],
  // 他のロール定義
};
```

## データ保護

### ローカルデータ暗号化

```dart
// lib/core/security/encryption_service.dart
import 'package:encrypt/encrypt.dart';

class EncryptionService {
  static final _key = Key.fromSecureRandom(32);
  static final _iv = IV.fromSecureRandom(16);
  static final _encrypter = Encrypter(AES(_key));
  
  // データ暗号化
  static String encrypt(String plainText) {
    final encrypted = _encrypter.encrypt(plainText, iv: _iv);
    return encrypted.base64;
  }
  
  // データ復号化
  static String decrypt(String encryptedText) {
    final encrypted = Encrypted.fromBase64(encryptedText);
    return _encrypter.decrypt(encrypted, iv: _iv);
  }
  
  // 機密データのマスキング
  static String maskSensitiveData(String data, SensitiveDataType type) {
    switch (type) {
      case SensitiveDataType.accountNumber:
        // 口座番号: 1234****5678
        return data.replaceRange(4, data.length - 4, '*' * (data.length - 8));
      case SensitiveDataType.amount:
        // 金額: ¥***,***
        return '¥${data.replaceAll(RegExp(r'\d'), '*')}';
      case SensitiveDataType.email:
        // メール: t***@example.com
        final parts = data.split('@');
        return '${parts[0][0]}***@${parts[1]}';
    }
  }
}
```

### 通信セキュリティ

```dart
// lib/core/services/secure_http_service.dart
class SecureHttpService {
  late final Dio _dio;
  
  SecureHttpService() {
    _dio = Dio();
    
    // HTTPS証明書ピンニング
    (_dio.httpClientAdapter as DefaultHttpClientAdapter).onHttpClientCreate = (client) {
      client.badCertificateCallback = (cert, host, port) {
        // 証明書のフィンガープリント検証
        final expectedFingerprint = Environment.certificateFingerprint;
        final actualFingerprint = sha256.convert(cert.der).toString();
        return actualFingerprint == expectedFingerprint;
      };
      return client;
    };
    
    // リクエストインターセプター
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // 認証トークン付与
          final token = await AuthService.getAccessToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          
          // セキュリティヘッダー
          options.headers['X-Request-ID'] = const Uuid().v4();
          options.headers['X-Client-Version'] = packageInfo.version;
          
          handler.next(options);
        },
        onError: (error, handler) async {
          // トークンリフレッシュ
          if (error.response?.statusCode == 401) {
            final newToken = await AuthService.refreshToken();
            if (newToken != null) {
              error.requestOptions.headers['Authorization'] = 'Bearer $newToken';
              final response = await _dio.fetch(error.requestOptions);
              return handler.resolve(response);
            }
          }
          handler.next(error);
        },
      ),
    );
  }
}
```

## 監査・ログ

### 監査ログ実装

```dart
// lib/core/audit/audit_logger.dart
@freezed
class AuditLog with _$AuditLog {
  const factory AuditLog({
    required String id,
    required DateTime timestamp,
    required String userId,
    required UserRole userRole,
    required String action,
    required String resource,
    required String deviceInfo,
    required String result,
    String? errorDetails,
    Map<String, dynamic>? metadata,
  }) = _AuditLog;
  
  factory AuditLog.fromJson(Map<String, dynamic> json) => 
      _$AuditLogFromJson(json);
}

class AuditLogger {
  static final _box = Hive.box<AuditLog>('audit_logs');
  
  // 監査ログ記録
  static Future<void> log({
    required String action,
    required String resource,
    required bool success,
    String? errorDetails,
    Map<String, dynamic>? metadata,
  }) async {
    final user = await AuthService.getCurrentUser();
    final deviceInfo = await DeviceInfoService.getInfo();
    
    final auditLog = AuditLog(
      id: const Uuid().v4(),
      timestamp: DateTime.now(),
      userId: user.id,
      userRole: user.role,
      action: action,
      resource: resource,
      deviceInfo: deviceInfo.toString(),
      result: success ? 'success' : 'failure',
      errorDetails: errorDetails,
      metadata: metadata,
    );
    
    // ローカル保存
    await _box.add(auditLog);
    
    // サーバー送信（非同期）
    _sendToServer(auditLog);
  }
  
  // ハッシュチェーンによる改ざん防止
  static String _generateHash(AuditLog log, String? previousHash) {
    final data = '${log.toJson()}$previousHash';
    return sha256.convert(utf8.encode(data)).toString();
  }
}
```

### セキュリティイベント監視

```dart
// lib/core/security/security_monitor.dart
class SecurityMonitor {
  static final _rules = <SecurityRule>[
    SecurityRule(
      name: '大量データアクセス',
      check: (logs) => logs.where((l) => l.action == 'export').length > 100,
      severity: Severity.high,
      action: (logs) => _notifyCEO('大量データアクセスを検知'),
    ),
    SecurityRule(
      name: '深夜アクセス',
      check: (log) {
        final hour = log.timestamp.hour;
        return hour < 6 || hour > 22;
      },
      severity: Severity.medium,
      action: (log) => _logAnomaly('深夜アクセス: ${log.userId}'),
    ),
    SecurityRule(
      name: '連続ログイン失敗',
      check: (logs) => logs.where((l) => 
        l.action == 'login' && l.result == 'failure'
      ).length >= 5,
      severity: Severity.high,
      action: (logs) => _lockAccount(logs.first.userId),
    ),
  ];
  
  // リアルタイム監視
  static void startMonitoring() {
    Timer.periodic(const Duration(minutes: 5), (_) async {
      final recentLogs = await AuditLogger.getRecentLogs(minutes: 5);
      
      for (final rule in _rules) {
        if (rule.check(recentLogs)) {
          await rule.action(recentLogs);
        }
      }
    });
  }
}
```

## 脆弱性対策

### 入力検証とサニタイゼーション

```dart
// lib/core/security/input_validator.dart
class InputValidator {
  // SQLインジェクション対策
  static bool isValidInput(String input, InputType type) {
    switch (type) {
      case InputType.amount:
        return RegExp(r'^\d+(\.\d{1,2})?$').hasMatch(input);
      case InputType.accountNumber:
        return RegExp(r'^\d{7,10}$').hasMatch(input);
      case InputType.email:
        return RegExp(r'^[\w\.\-]+@[\w\.\-]+\.\w+$').hasMatch(input);
      case InputType.general:
        // 危険な文字のチェック
        return !RegExp(r'[<>\"\'%;()&+]').hasMatch(input);
    }
  }
  
  // XSS対策（HTMLエスケープ）
  static String sanitizeHtml(String input) {
    return input
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#x27;');
  }
}
```

### セキュアコーディング

```dart
// lib/core/security/secure_coding.dart

// 1. ハードコーディングされた認証情報の禁止
// ❌ 悪い例
// const apiKey = 'sk-1234567890abcdef';

// ✅ 良い例
final apiKey = await SecureStorage.read('api_key');

// 2. 安全な乱数生成
import 'dart:math';
final secureRandom = Random.secure();
final randomBytes = List<int>.generate(32, (i) => secureRandom.nextInt(256));

// 3. タイミング攻撃対策
bool constantTimeCompare(String a, String b) {
  if (a.length != b.length) return false;
  
  var result = 0;
  for (var i = 0; i < a.length; i++) {
    result |= a.codeUnitAt(i) ^ b.codeUnitAt(i);
  }
  return result == 0;
}
```

## コンプライアンス

### 電子帳簿保存法対応

```dart
// lib/features/compliance/services/e_tax_service.dart
class ETaxService {
  // タイムスタンプ付与（24時間以内）
  static Future<void> addTimestamp(Document document) async {
    final timestamp = await TimestampAuthority.getTimestamp(
      data: document.hash,
      provider: 'secom-trust',
    );
    
    document.timestamp = Timestamp(
      authority: timestamp.authority,
      time: timestamp.time,
      hash: timestamp.hash,
    );
    
    await document.save();
  }
  
  // 検索要件対応
  static Future<List<Document>> searchDocuments({
    DateTime? dateFrom,
    DateTime? dateTo,
    double? amountFrom,
    double? amountTo,
    String? counterparty,
  }) async {
    return await DocumentRepository.search(
      SearchCriteria(
        dateRange: DateRange(from: dateFrom, to: dateTo),
        amountRange: AmountRange(from: amountFrom, to: amountTo),
        counterparty: counterparty,
      ),
    );
  }
}
```

### プライバシー保護

```dart
// lib/core/privacy/privacy_manager.dart
class PrivacyManager {
  // 個人情報の最小化
  static Map<String, dynamic> minimizePersonalData(User user) {
    return {
      'id': user.id,
      'role': user.role.value,
      // 必要最小限の情報のみ
    };
  }
  
  // データ保持期限管理
  static Future<void> enforceDataRetention() async {
    final expiredLogs = await AuditLogger.getLogsOlderThan(
      DateTime.now().subtract(const Duration(days: 2555)), // 7年
    );
    
    for (final log in expiredLogs) {
      await log.delete();
    }
  }
}
```

## セキュリティテスト

### 自動セキュリティチェック

```yaml
# .github/workflows/security.yml
name: Security Check

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # 依存関係の脆弱性チェック
      - name: Run OSV Scanner
        uses: google/osv-scanner-action@v1
        
      # シークレットスキャン
      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        
      # SAST（静的解析）
      - name: Run Dart Analyzer
        run: flutter analyze --no-fatal-warnings
```

## インシデント対応

### 対応フロー

```dart
// lib/core/security/incident_response.dart
class IncidentResponse {
  static Future<void> handleSecurityIncident(SecurityIncident incident) async {
    // 1. 初期対応
    await _containIncident(incident);
    
    // 2. 通知
    switch (incident.severity) {
      case Severity.critical:
        await _notifyCEO(incident);
        await _notifySecurityTeam(incident);
        break;
      case Severity.high:
        await _notifyCFO(incident);
        break;
      case Severity.medium:
      case Severity.low:
        await _logIncident(incident);
        break;
    }
    
    // 3. 調査
    final investigation = await _investigate(incident);
    
    // 4. 対策
    await _remediate(investigation);
    
    // 5. レポート
    await _generateReport(incident, investigation);
  }
}
```

## チェックリスト

### Phase 2（実装中）
- [x] 生体認証（Touch ID/Face ID）
- [x] JWT認証
- [x] セキュアストレージ
- [x] HTTPS通信
- [x] 基本的な監査ログ
- [ ] 証明書ピンニング
- [ ] 入力検証

### Phase 3（計画中）
- [ ] 多要素認証（TOTP）
- [ ] 高度な異常検知
- [ ] 自動脆弱性スキャン
- [ ] ペネトレーションテスト

### Phase 4（将来）
- [ ] ゼロトラストアーキテクチャ
- [ ] AI/ML脅威検知
- [ ] 量子暗号対応準備