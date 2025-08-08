import 'dart:convert';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// ローカルストレージ管理サービス
class StorageService {
  static late Box _preferencesBox;
  static late Box _cacheBox;
  static const _secureStorage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainItemAccessibility.first_unlock_this_device,
    ),
  );
  
  /// 初期化
  static Future<void> initialize() async {
    _preferencesBox = await Hive.openBox('preferences');
    _cacheBox = await Hive.openBox('cache');
  }
  
  // === 通常のストレージ（Hive） ===
  
  /// 設定保存
  static Future<void> setPreference<T>(String key, T value) async {
    await _preferencesBox.put(key, value);
  }
  
  /// 設定取得
  static T? getPreference<T>(String key, {T? defaultValue}) {
    return _preferencesBox.get(key, defaultValue: defaultValue) as T?;
  }
  
  /// キャッシュ保存
  static Future<void> setCache<T>(String key, T value) async {
    await _cacheBox.put(key, value);
  }
  
  /// キャッシュ取得
  static T? getCache<T>(String key) {
    return _cacheBox.get(key) as T?;
  }
  
  /// キャッシュ削除
  static Future<void> deleteCache(String key) async {
    await _cacheBox.delete(key);
  }
  
  /// 全キャッシュ削除
  static Future<void> clearCache() async {
    await _cacheBox.clear();
  }
  
  // === セキュアストレージ（認証情報等） ===
  
  /// セキュアデータ保存
  static Future<void> setSecureData(String key, String value) async {
    await _secureStorage.write(key: key, value: value);
  }
  
  /// セキュアデータ取得
  static Future<String?> getSecureData(String key) async {
    return await _secureStorage.read(key: key);
  }
  
  /// セキュアデータ削除
  static Future<void> deleteSecureData(String key) async {
    await _secureStorage.delete(key: key);
  }
  
  /// 全セキュアデータ削除
  static Future<void> clearSecureData() async {
    await _secureStorage.deleteAll();
  }
  
  // === 便利メソッド ===
  
  /// ユーザートークン保存
  static Future<void> setUserToken(String token) async {
    await setSecureData('user_token', token);
  }
  
  /// ユーザートークン取得
  static Future<String?> getUserToken() async {
    return await getSecureData('user_token');
  }
  
  /// ユーザートークン削除
  static Future<void> clearUserToken() async {
    await deleteSecureData('user_token');
  }
  
  /// ログアウト処理（全認証情報削除）
  static Future<void> logout() async {
    await clearSecureData();
    await clearCache();
  }
  
  // === 認証関連のメソッド ===
  
  /// トークン保存
  Future<void> saveToken(String token) async {
    await _secureStorage.write(key: 'auth_token', value: token);
  }

  /// トークン取得
  Future<String?> getToken() async {
    return await _secureStorage.read(key: 'auth_token');
  }

  /// トークンクリア
  Future<void> clearToken() async {
    await _secureStorage.delete(key: 'auth_token');
  }

  /// リフレッシュトークン保存
  Future<void> saveRefreshToken(String refreshToken) async {
    await _secureStorage.write(key: 'refresh_token', value: refreshToken);
  }

  /// リフレッシュトークン取得
  Future<String?> getRefreshToken() async {
    return await _secureStorage.read(key: 'refresh_token');
  }

  /// リフレッシュトークンクリア
  Future<void> clearRefreshToken() async {
    await _secureStorage.delete(key: 'refresh_token');
  }

  /// ユーザー情報保存
  Future<void> saveUserInfo(Map<String, dynamic> userInfo) async {
    final userInfoJson = jsonEncode(userInfo);
    await _secureStorage.write(key: 'user_info', value: userInfoJson);
  }

  /// ユーザー情報取得
  Future<Map<String, dynamic>?> getUserInfo() async {
    final userInfoJson = await _secureStorage.read(key: 'user_info');
    if (userInfoJson == null) return null;
    return jsonDecode(userInfoJson) as Map<String, dynamic>;
  }

  /// ユーザー情報クリア
  Future<void> clearUserInfo() async {
    await _secureStorage.delete(key: 'user_info');
  }
  
  /// ダッシュボードデータキャッシュ
  static Future<void> cacheDashboardData(Map<String, dynamic> data) async {
    await setCache('dashboard_data', data);
    await setCache('dashboard_cached_at', DateTime.now().millisecondsSinceEpoch);
  }
  
  /// ダッシュボードデータ取得（期限チェック付き）
  static Map<String, dynamic>? getCachedDashboardData({
    Duration maxAge = const Duration(minutes: 5),
  }) {
    final cachedAt = getCache<int>('dashboard_cached_at');
    if (cachedAt == null) return null;
    
    final cacheTime = DateTime.fromMillisecondsSinceEpoch(cachedAt);
    if (DateTime.now().difference(cacheTime) > maxAge) {
      deleteCache('dashboard_data');
      deleteCache('dashboard_cached_at');
      return null;
    }
    
    return getCache<Map<String, dynamic>>('dashboard_data');
  }
  
  /// KPIデータキャッシュ
  static Future<void> cacheKpiData(Map<String, dynamic> data) async {
    await setCache('kpi_data', data);
    await setCache('kpi_cached_at', DateTime.now().millisecondsSinceEpoch);
  }
  
  /// KPIデータ取得（期限チェック付き）
  static Map<String, dynamic>? getCachedKpiData({
    Duration maxAge = const Duration(minutes: 15),
  }) {
    final cachedAt = getCache<int>('kpi_cached_at');
    if (cachedAt == null) return null;
    
    final cacheTime = DateTime.fromMillisecondsSinceEpoch(cachedAt);
    if (DateTime.now().difference(cacheTime) > maxAge) {
      deleteCache('kpi_data');
      deleteCache('kpi_cached_at');
      return null;
    }
    
    return getCache<Map<String, dynamic>>('kpi_data');
  }
}