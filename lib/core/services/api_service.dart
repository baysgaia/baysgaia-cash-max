import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../config/app_config.dart';
import '../utils/logger.dart';
import 'storage_service.dart';

/// API通信サービス
class ApiService {
  late final Dio _dio;
  final StorageService _storageService = StorageService();

  ApiService() {
    _dio = Dio();
    _setupInterceptors();
  }

  void _setupInterceptors() {
    // ベースURL設定
    _dio.options.baseUrl = AppConfig.apiBaseUrl;
    _dio.options.connectTimeout = const Duration(seconds: 30);
    _dio.options.receiveTimeout = const Duration(seconds: 30);

    // 認証インターセプター
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          // 認証が必要なエンドポイントの場合はトークンを追加
          if (!_isPublicEndpoint(options.path)) {
            final token = await _storageService.getToken();
            if (token != null) {
              options.headers['Authorization'] = 'Bearer $token';
            }
          }
          
          // リクエストログ
          AppLogger.apiCall(
            options.method,
            options.path,
            params: options.queryParameters.isNotEmpty 
                ? options.queryParameters 
                : options.data,
          );
          
          handler.next(options);
        },
        onResponse: (response, handler) {
          // レスポンスログ
          AppLogger.apiCall(
            response.requestOptions.method,
            response.requestOptions.path,
            statusCode: response.statusCode,
          );
          
          handler.next(response);
        },
        onError: (error, handler) async {
          // エラーログ
          AppLogger.error(
            'API Error: ${error.requestOptions.method} ${error.requestOptions.path}',
            error,
          );

          // 401エラーの場合はトークンリフレッシュを試行
          if (error.response?.statusCode == 401 && 
              !_isAuthEndpoint(error.requestOptions.path)) {
            final newToken = await _refreshToken();
            if (newToken != null) {
              // トークンを更新してリトライ
              error.requestOptions.headers['Authorization'] = 'Bearer $newToken';
              final clonedRequest = await _dio.request(
                error.requestOptions.path,
                options: Options(
                  method: error.requestOptions.method,
                  headers: error.requestOptions.headers,
                ),
                data: error.requestOptions.data,
                queryParameters: error.requestOptions.queryParameters,
              );
              return handler.resolve(clonedRequest);
            }
          }

          handler.next(error);
        },
      ),
    );

    // ログインターセプター（デバッグビルドのみ）
    if (kDebugMode) {
      _dio.interceptors.add(LogInterceptor(
        requestBody: true,
        responseBody: true,
        requestHeader: false,
        responseHeader: false,
      ));
    }
  }

  /// GETリクエスト
  Future<Map<String, dynamic>> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.get(
        path,
        queryParameters: queryParameters,
        options: options,
      );
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// POSTリクエスト
  Future<Map<String, dynamic>> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// PUTリクエスト
  Future<Map<String, dynamic>> put(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.put(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// DELETEリクエスト
  Future<Map<String, dynamic>> delete(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    try {
      final response = await _dio.delete(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
      );
      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// ファイルアップロード
  Future<Map<String, dynamic>> uploadFile(
    String path,
    String filePath, {
    String fieldName = 'file',
    Map<String, dynamic>? additionalData,
    ProgressCallback? onSendProgress,
  }) async {
    try {
      final formData = FormData.fromMap({
        fieldName: await MultipartFile.fromFile(filePath),
        ...?additionalData,
      });

      final response = await _dio.post(
        path,
        data: formData,
        options: Options(
          headers: {'Content-Type': 'multipart/form-data'},
        ),
        onSendProgress: onSendProgress,
      );

      return _handleResponse(response);
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  /// レスポンス処理
  Map<String, dynamic> _handleResponse(Response response) {
    if (response.statusCode! >= 200 && response.statusCode! < 300) {
      return response.data as Map<String, dynamic>;
    } else {
      throw ApiException(
        message: 'HTTP ${response.statusCode}: ${response.statusMessage}',
        statusCode: response.statusCode!,
        response: response.data,
      );
    }
  }

  /// エラー処理
  Exception _handleError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
        return ApiException(
          message: '接続がタイムアウトしました',
          statusCode: 0,
          originalError: error,
        );
      case DioExceptionType.sendTimeout:
        return ApiException(
          message: '送信がタイムアウトしました',
          statusCode: 0,
          originalError: error,
        );
      case DioExceptionType.receiveTimeout:
        return ApiException(
          message: '応答がタイムアウトしました',
          statusCode: 0,
          originalError: error,
        );
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode ?? 0;
        final message = error.response?.data?['message'] ?? 
                       error.response?.statusMessage ?? 
                       'サーバーエラーが発生しました';
        return ApiException(
          message: message,
          statusCode: statusCode,
          response: error.response?.data,
          originalError: error,
        );
      case DioExceptionType.cancel:
        return ApiException(
          message: 'リクエストがキャンセルされました',
          statusCode: 0,
          originalError: error,
        );
      case DioExceptionType.unknown:
        return ApiException(
          message: 'ネットワークエラーが発生しました',
          statusCode: 0,
          originalError: error,
        );
      default:
        return ApiException(
          message: '不明なエラーが発生しました',
          statusCode: 0,
          originalError: error,
        );
    }
  }

  /// トークンリフレッシュ
  Future<String?> _refreshToken() async {
    try {
      final refreshToken = await _storageService.getRefreshToken();
      if (refreshToken == null) return null;

      final response = await _dio.post(
        '/api/auth/refresh',
        data: {'refresh_token': refreshToken},
        options: Options(
          headers: {'Authorization': null}, // トークンなしで送信
        ),
      );

      final newToken = response.data['token'] as String?;
      final newRefreshToken = response.data['refresh_token'] as String?;

      if (newToken != null) {
        await _storageService.saveToken(newToken);
      }
      if (newRefreshToken != null) {
        await _storageService.saveRefreshToken(newRefreshToken);
      }

      return newToken;
    } catch (e) {
      AppLogger.error('Token refresh failed', e);
      // リフレッシュトークンも無効な場合はクリア
      await _storageService.clearToken();
      await _storageService.clearRefreshToken();
      await _storageService.clearUserInfo();
      return null;
    }
  }

  /// 認証不要のエンドポイントかチェック
  bool _isPublicEndpoint(String path) {
    const publicPaths = [
      '/api/auth/login',
      '/api/auth/refresh',
      '/api/auth/register',
      '/api/auth/reset-password',
      '/api/health',
    ];
    return publicPaths.any((publicPath) => path.startsWith(publicPath));
  }

  /// 認証関連のエンドポイントかチェック
  bool _isAuthEndpoint(String path) {
    return path.startsWith('/api/auth/');
  }

  /// Dioインスタンスを取得（必要な場合）
  Dio get dio => _dio;

  /// APIサービスをクローズ
  void close() {
    _dio.close();
  }
}

/// API例外クラス
class ApiException implements Exception {
  final String message;
  final int statusCode;
  final Map<String, dynamic>? response;
  final DioException? originalError;

  const ApiException({
    required this.message,
    required this.statusCode,
    this.response,
    this.originalError,
  });

  @override
  String toString() => 'ApiException: $message (Status: $statusCode)';

  /// レスポンスからエラーメッセージを取得
  String get userFriendlyMessage {
    if (statusCode == 0) {
      return '接続エラー: インターネット接続を確認してください';
    }
    
    switch (statusCode) {
      case 400:
        return response?['message'] ?? '入力内容に問題があります';
      case 401:
        return 'ログインが必要です';
      case 403:
        return 'この操作を実行する権限がありません';
      case 404:
        return '要求されたリソースが見つかりません';
      case 422:
        return response?['message'] ?? '入力データが無効です';
      case 429:
        return 'リクエストが多すぎます。しばらくお待ちください';
      case 500:
        return 'サーバーエラーが発生しました';
      case 502:
      case 503:
      case 504:
        return 'サーバーが一時的に利用できません';
      default:
        return message;
    }
  }

  /// バリデーションエラーを取得
  Map<String, List<String>>? get validationErrors {
    if (statusCode == 422 && response?['errors'] != null) {
      final errors = response!['errors'] as Map<String, dynamic>;
      return errors.map(
        (key, value) => MapEntry(
          key,
          (value as List).map((e) => e.toString()).toList(),
        ),
      );
    }
    return null;
  }
}