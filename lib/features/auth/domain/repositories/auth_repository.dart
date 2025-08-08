import '../entities/user.dart';

/// 認証リポジトリインターフェース
abstract class AuthRepository {
  /// 現在のユーザー情報を取得
  Future<User?> getCurrentUser();

  /// ログイン処理
  Future<User> login(String email, String password);

  /// ログアウト処理
  Future<void> logout();

  /// パスワードリセット
  Future<void> resetPassword(String email);

  /// トークンをリフレッシュ
  Future<String?> refreshToken();

  /// ユーザー情報を更新
  Future<User> updateUser(User user);

  /// 認証状態の変更を監視
  Stream<User?> authStateChanges();
}