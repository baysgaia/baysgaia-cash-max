import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import '../../../core/utils/logger.dart';
import '../domain/entities/user.dart';
import '../domain/repositories/auth_repository.dart';
import '../data/repositories/auth_repository_impl.dart';

part 'auth_provider.freezed.dart';

/// 認証状態
@freezed
class AuthState with _$AuthState {
  const factory AuthState.initial() = AuthStateInitial;
  const factory AuthState.loading() = AuthStateLoading;
  const factory AuthState.authenticated(User user) = AuthStateAuthenticated;
  const factory AuthState.unauthenticated() = AuthStateUnauthenticated;
  const factory AuthState.error(String message) = AuthStateError;
}

/// 認証状態管理
class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._repository) : super(const AuthState.initial()) {
    _checkAuthStatus();
  }

  final AuthRepository _repository;

  /// 認証状態確認
  Future<void> _checkAuthStatus() async {
    state = const AuthState.loading();
    try {
      final user = await _repository.getCurrentUser();
      if (user != null) {
        AppLogger.info('ユーザー認証済み: ${user.email}');
        state = AuthState.authenticated(user);
      } else {
        AppLogger.info('ユーザー未認証');
        state = const AuthState.unauthenticated();
      }
    } catch (e, stackTrace) {
      AppLogger.error('認証状態確認エラー', e, stackTrace);
      state = AuthState.error(e.toString());
    }
  }

  /// ログイン処理
  Future<void> login(String email, String password) async {
    AppLogger.userAction('login_attempt', properties: {'email': email});
    state = const AuthState.loading();
    
    try {
      final user = await _repository.login(email, password);
      AppLogger.info('ログイン成功: ${user.email}');
      AppLogger.businessEvent('user_login', data: {'user_id': user.id});
      state = AuthState.authenticated(user);
    } catch (e, stackTrace) {
      AppLogger.error('ログインエラー', e, stackTrace);
      AppLogger.security('login_failed', data: {'email': email, 'error': e.toString()});
      state = AuthState.error(e.toString());
    }
  }

  /// ログアウト処理
  Future<void> logout() async {
    AppLogger.userAction('logout');
    state = const AuthState.loading();
    
    try {
      await _repository.logout();
      AppLogger.info('ログアウト完了');
      AppLogger.businessEvent('user_logout');
      state = const AuthState.unauthenticated();
    } catch (e, stackTrace) {
      AppLogger.error('ログアウトエラー', e, stackTrace);
      state = AuthState.error(e.toString());
    }
  }

  /// パスワードリセット
  Future<void> resetPassword(String email) async {
    AppLogger.userAction('password_reset_request', properties: {'email': email});
    
    try {
      await _repository.resetPassword(email);
      AppLogger.info('パスワードリセット要求送信: $email');
      AppLogger.businessEvent('password_reset_requested');
    } catch (e, stackTrace) {
      AppLogger.error('パスワードリセットエラー', e, stackTrace);
      rethrow;
    }
  }

  /// 認証状態をリフレッシュ
  Future<void> refresh() async {
    await _checkAuthStatus();
  }
}

/// 認証リポジトリプロバイダー
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl();
});

/// 認証状態プロバイダー
final authStateProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return AuthNotifier(repository);
});

/// 現在のユーザー情報プロバイダー
final currentUserProvider = Provider<User?>((ref) {
  return ref.watch(authStateProvider).maybeWhen(
    authenticated: (user) => user,
    orElse: () => null,
  );
});

/// 認証済みかどうかのプロバイダー
final isAuthenticatedProvider = Provider<bool>((ref) {
  return ref.watch(authStateProvider).maybeWhen(
    authenticated: (_) => true,
    orElse: () => false,
  );
});