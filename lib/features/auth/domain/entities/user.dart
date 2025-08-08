import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

/// ユーザーエンティティ
@freezed
class User with _$User {
  const factory User({
    required String id,
    required String email,
    required String name,
    required String role,
    required DateTime createdAt,
    DateTime? lastLoginAt,
    @Default(true) bool isActive,
    String? avatarUrl,
    String? department,
    String? phoneNumber,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}

/// ユーザーロール列挙
enum UserRole {
  admin,
  manager,
  user,
  viewer;

  String get displayName {
    switch (this) {
      case UserRole.admin:
        return '管理者';
      case UserRole.manager:
        return '経営陣';
      case UserRole.user:
        return 'ユーザー';
      case UserRole.viewer:
        return '閲覧者';
    }
  }

  bool get canManageKpis {
    return this == UserRole.admin || this == UserRole.manager;
  }

  bool get canManageSettings {
    return this == UserRole.admin;
  }

  bool get canViewFinancialData {
    return true; // 全ユーザーが財務データを閲覧可能
  }

  bool get canManageSubsidies {
    return this == UserRole.admin || this == UserRole.manager;
  }

  bool get canManageProcesses {
    return this == UserRole.admin || this == UserRole.manager;
  }

  bool get canManageRisks {
    return this == UserRole.admin || this == UserRole.manager;
  }
}

extension UserExtension on User {
  UserRole get userRole {
    try {
      return UserRole.values.firstWhere(
        (r) => r.name == role.toLowerCase(),
      );
    } catch (e) {
      return UserRole.viewer; // デフォルトは閲覧者
    }
  }

  String get displayName => name.isNotEmpty ? name : email.split('@').first;

  bool get isAdmin => userRole == UserRole.admin;
  bool get isManager => userRole == UserRole.manager;
  bool get canManage => isAdmin || isManager;

  String get initials {
    if (name.isEmpty) return '?';
    final words = name.split(' ');
    if (words.length == 1) {
      return words[0].substring(0, 1).toUpperCase();
    } else {
      return words.take(2).map((w) => w.substring(0, 1).toUpperCase()).join();
    }
  }
}