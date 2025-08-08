import 'package:freezed_annotation/freezed_annotation.dart';
import '../../domain/entities/user.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

/// ユーザーデータモデル
@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String email,
    required String name,
    required String role,
    required String createdAt,
    String? lastLoginAt,
    @Default(true) bool isActive,
    String? avatarUrl,
    String? department,
    String? phoneNumber,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);
}

extension UserModelExtension on UserModel {
  /// エンティティに変換
  User toEntity() {
    return User(
      id: id,
      email: email,
      name: name,
      role: role,
      createdAt: DateTime.parse(createdAt),
      lastLoginAt: lastLoginAt != null ? DateTime.parse(lastLoginAt!) : null,
      isActive: isActive,
      avatarUrl: avatarUrl,
      department: department,
      phoneNumber: phoneNumber,
    );
  }

  /// エンティティから変換
  static UserModel fromEntity(User user) {
    return UserModel(
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt.toIso8601String(),
      lastLoginAt: user.lastLoginAt?.toIso8601String(),
      isActive: user.isActive,
      avatarUrl: user.avatarUrl,
      department: user.department,
      phoneNumber: user.phoneNumber,
    );
  }
}