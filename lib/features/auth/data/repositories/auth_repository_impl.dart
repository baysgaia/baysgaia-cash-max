import 'dart:async';
import '../../domain/entities/user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../../../core/services/storage_service.dart';
import '../../../../core/services/api_service.dart';
import '../../../../core/utils/logger.dart';
import '../models/auth_response_model.dart';
import '../models/user_model.dart';

/// 認証リポジトリ実装
class AuthRepositoryImpl implements AuthRepository {
  final ApiService _apiService = ApiService();
  final StorageService _storageService = StorageService();
  final StreamController<User?> _authStateController = StreamController<User?>.broadcast();

  @override
  Future<User?> getCurrentUser() async {
    try {
      // ストレージからトークン取得
      final token = await _storageService.getToken();
      if (token == null) return null;

      // ユーザー情報をキャッシュから取得
      final userJson = await _storageService.getUserInfo();
      if (userJson != null) {
        final userModel = UserModel.fromJson(userJson);
        return userModel.toEntity();
      }

      // APIからユーザー情報を取得
      final response = await _apiService.get('/api/auth/me');
      final userModel = UserModel.fromJson(response['user']);
      
      // キャッシュに保存
      await _storageService.saveUserInfo(userModel.toJson());
      
      return userModel.toEntity();
    } catch (e, stackTrace) {
      AppLogger.error('getCurrentUser エラー', e, stackTrace);
      // トークンが無効な場合はクリア
      await _clearAuthData();
      return null;
    }
  }

  @override
  Future<User> login(String email, String password) async {
    try {
      final response = await _apiService.post(
        '/api/auth/login',
        data: {
          'email': email,
          'password': password,
          'device_info': await _getDeviceInfo(),
        },
      );

      final authResponse = AuthResponseModel.fromJson(response);
      
      // トークンとユーザー情報を保存
      await _storageService.saveToken(authResponse.token);
      await _storageService.saveRefreshToken(authResponse.refreshToken);
      await _storageService.saveUserInfo(authResponse.user.toJson());
      
      final user = authResponse.user.toEntity();
      _authStateController.add(user);
      
      return user;
    } catch (e, stackTrace) {
      AppLogger.error('login エラー', e, stackTrace);
      await _clearAuthData();
      rethrow;
    }
  }

  @override
  Future<void> logout() async {
    try {
      // サーバーにログアウトリクエスト
      final token = await _storageService.getToken();
      if (token != null) {
        try {
          await _apiService.post('/api/auth/logout');
        } catch (e) {
          // サーバーエラーでもローカルデータはクリア
          AppLogger.warning('logout API エラー（続行）', e);
        }
      }
    } finally {
      await _clearAuthData();
      _authStateController.add(null);
    }
  }

  @override
  Future<void> resetPassword(String email) async {
    try {
      await _apiService.post(
        '/api/auth/reset-password',
        data: {'email': email},
      );
    } catch (e, stackTrace) {
      AppLogger.error('resetPassword エラー', e, stackTrace);
      rethrow;
    }
  }

  @override
  Future<String?> refreshToken() async {
    try {
      final refreshToken = await _storageService.getRefreshToken();
      if (refreshToken == null) return null;

      final response = await _apiService.post(
        '/api/auth/refresh',
        data: {'refresh_token': refreshToken},
      );

      final newToken = response['token'] as String;
      final newRefreshToken = response['refresh_token'] as String?;
      
      await _storageService.saveToken(newToken);
      if (newRefreshToken != null) {
        await _storageService.saveRefreshToken(newRefreshToken);
      }
      
      return newToken;
    } catch (e, stackTrace) {
      AppLogger.error('refreshToken エラー', e, stackTrace);
      await _clearAuthData();
      return null;
    }
  }

  @override
  Future<User> updateUser(User user) async {
    try {
      final response = await _apiService.put(
        '/api/auth/profile',
        data: UserModel.fromEntity(user).toJson(),
      );

      final updatedUserModel = UserModel.fromJson(response['user']);
      
      // キャッシュを更新
      await _storageService.saveUserInfo(updatedUserModel.toJson());
      
      final updatedUser = updatedUserModel.toEntity();
      _authStateController.add(updatedUser);
      
      return updatedUser;
    } catch (e, stackTrace) {
      AppLogger.error('updateUser エラー', e, stackTrace);
      rethrow;
    }
  }

  @override
  Stream<User?> authStateChanges() {
    return _authStateController.stream;
  }

  /// 認証データをクリア
  Future<void> _clearAuthData() async {
    await _storageService.clearToken();
    await _storageService.clearRefreshToken();
    await _storageService.clearUserInfo();
  }

  /// デバイス情報を取得（将来的にデバイス情報パッケージを使用）
  Future<Map<String, dynamic>> _getDeviceInfo() async {
    return {
      'platform': 'flutter',
      'app_version': '1.0.0', // AppConfigから取得予定
      'timestamp': DateTime.now().toIso8601String(),
    };
  }

  void dispose() {
    _authStateController.close();
  }
}