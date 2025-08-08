# BAYSGAiA 現金残高最大化プロジェクト - Flutter財務改革システム

![Flutter](https://img.shields.io/badge/Flutter-3.10.0+-02569B?logo=flutter)
![Dart](https://img.shields.io/badge/Dart-3.0.0+-0175C2?logo=dart)
![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web%20%7C%20Desktop-brightgreen)
![License](https://img.shields.io/badge/License-Proprietary-red)

## 🎯 プロジェクト概要

BAYSGAiA（株式会社ベイスガイア）の現金残高最大化を目指すFlutterベース財務改革システムです。2025年1月設立の新規AI開発企業として、自社のAI技術力を最大限活用し、外部コンサルタントに依存しない内製化により、持続可能なキャッシュフロー最大化を実現します。

### 🏢 企業情報
- **企業名**: BAYSGAiA（株式会社ベイスガイア）
- **設立**: 2025年1月
- **従業員数**: 5名以下（小規模企業の機動性を最大限活用）
- **事業内容**: AI開発（生成AI、MLOps、プロンプトエンジニアリング専門）
- **代表取締役CEO**: 籾倉丸紀

### 📅 プロジェクト情報
- **実施期間**: 2025年8月〜2025年12月（約4ヶ月）
- **現在フェーズ**: Phase 2 - システム導入（Week 4-7）
- **投資効果**: ROI 775%（年間効果額3,490万円）

### 💰 現状の財務課題
- **現金預金残高**: 0円（極めて逼迫）
- **売掛金回収**: AI開発プロジェクトの長期化により遅延
- **流動比率**: 150%（目標200%以上に未達）

## 📊 プロジェクトOKR（目標と主要成果）

| KR | 目標 | 期限 | 現状 | ステータス |
|---|------|------|------|------------|
| **KR1** | 月末現金残高 +20% | 3ヶ月以内 | 5.2% | 🔴 要改善 |
| **KR2** | キャッシュ転換日数（CCC）-25%<br>75日→56日 | 4ヶ月以内 | 18% | 🟢 順調 |
| **KR3** | 売上債権回収日数（DSO）-30%<br>65日→45日 | 2ヶ月以内 | 22% | 🟢 順調 |
| **KR4** | 資金予測精度 ≧95% | 2ヶ月以内 | 92.5% | 🟢 順調 |
| **KR5** | 資金関連プロセス自動化 70% | 4ヶ月以内 | 35% | 🔴 要改善 |

## 🏗️ システム構成

### 5つの主要モジュール
1. **📈 財務ダッシュボード**: リアルタイムKPIモニタリングと分析
2. **💴 補助金・融資管理**: 公的支援の申請・管理・報告
3. **🤖 プロセス自動化**: 業務フローの最適化とAI活用
4. **⚠️ リスク管理**: 財務リスクの監視とアラート
5. **📋 プロジェクト管理**: 4フェーズ実行計画の進捗管理

### 主要機能
- **GMOあおぞらネット銀行API連携**: リアルタイム残高照会・取引履歴
- **AI予測モデル**: 資金繰り予測（精度95%以上目標）
- **生体認証**: Touch ID / Face ID対応
- **オフライン対応**: PWA技術によるオフライン機能
- **マルチプラットフォーム**: iOS/Android/Web/Desktop完全対応

## 💻 技術スタック

### コア技術
```yaml
Flutter: ^3.10.0
Dart: ^3.0.0
```

### 主要パッケージ
| カテゴリ | パッケージ | バージョン | 用途 |
|---------|-----------|------------|------|
| 状態管理 | flutter_riverpod | ^2.4.9 | Provider Pattern実装 |
| ルーティング | go_router | ^12.1.3 | 宣言的ルーティング |
| HTTP通信 | dio | ^5.4.0 | API通信・インターセプター |
| データ保存 | hive_flutter | ^1.1.0 | NoSQLローカルDB |
| セキュリティ | flutter_secure_storage | ^9.0.0 | 暗号化ストレージ |
| チャート | fl_chart | ^0.65.0 | データビジュアライゼーション |
| 金融計算 | decimal | ^2.3.3 | 高精度数値計算 |
| 認証 | local_auth | latest | 生体認証 |

### アーキテクチャ
- **設計パターン**: Clean Architecture + MVVM
- **状態管理**: Riverpod Provider Pattern
- **データ層**: Repository Pattern + API Service
- **UI設計**: Material Design 3 + Responsive Design

## 🚀 セットアップ

### 必要要件
- Flutter 3.10.0以上
- Dart 3.0.0以上
- Android Studio / VS Code
- Xcode（iOS開発時）

### インストール手順

```bash
# リポジトリクローン
git clone git@github.com:baysgaia/baysgaia-cash-max.git
cd baysgaia-cash-max

# 依存関係インストール
flutter pub get

# コード生成（Freezed, JsonSerializable）
flutter pub run build_runner build --delete-conflicting-outputs

# 開発サーバー起動
flutter run

# プラットフォーム指定起動
flutter run -d chrome      # Web
flutter run -d ios         # iOS
flutter run -d android     # Android
```

## 📱 ビルド・デプロイ

### 開発ビルド
```bash
# 静的解析
flutter analyze

# テスト実行
flutter test

# カバレッジ付きテスト
flutter test --coverage
```

### リリースビルド
```bash
# Web版
flutter build web --release --dart-define=ENVIRONMENT=production

# iOS版
flutter build ios --release
flutter build ipa --export-options-plist=ios/ExportOptions.plist

# Android版
flutter build appbundle --release

# デスクトップ版
flutter build macos --release
flutter build windows --release
flutter build linux --release
```

## 📁 プロジェクト構造

```
baysgaia-cash-max/
├── lib/
│   ├── main.dart                 # エントリーポイント
│   ├── app/                      # アプリケーション設定
│   │   ├── app.dart             # メインアプリウィジェット
│   │   └── router/              # ルーティング設定
│   ├── core/                     # 共通機能
│   │   ├── config/              # 環境設定
│   │   ├── services/            # 共通サービス（API、Storage等）
│   │   ├── theme/               # テーマ設定
│   │   └── utils/               # ユーティリティ
│   ├── features/                 # 機能別モジュール
│   │   ├── auth/                # 認証（生体認証、JWT）
│   │   ├── dashboard/           # ダッシュボード
│   │   ├── kpi/                 # KPI管理
│   │   ├── cashflow/            # キャッシュフロー分析
│   │   ├── subsidy/             # 補助金・融資管理
│   │   ├── process/             # プロセス自動化
│   │   ├── risk/                # リスク管理
│   │   └── project/             # プロジェクト管理
│   └── shared/                   # 共有コンポーネント
│       └── widgets/             # 共通ウィジェット
├── assets/                       # アセット（画像、フォント等）
├── test/                         # テストコード
└── docs/                         # ドキュメント
    ├── business/                # ビジネス文書
    ├── technical/               # 技術文書
    └── api/                     # API仕様
```

## 📈 実装ロードマップ

### Phase 1: 基盤構築（Week 0-3）✅ 完了
- 現状分析とKPIベースライン策定
- GMOあおぞらネット銀行API接続PoC
- 緊急資金調達計画（日本政策金融公庫融資）

### Phase 2: システム導入（Week 4-7）🔄 実施中
- Flutterアプリケーション本格開発
- 主要機能実装（ダッシュボード、KPI、API連携）
- IT導入補助金申請（第5次：9月22日締切）

### Phase 3: プロセス変革（Week 8-11）📅 予定
- 業務プロセス自動化（70%目標）
- AI予測モデル統合
- リアルタイム監視システム

### Phase 4: 最適化＆拡張（Week 12-16）📅 予定
- パフォーマンス最適化
- 高度な分析機能（What-if分析）
- API公開準備

## 💰 資金調達計画（最大1億5,050万円）

### 優先度順
1. **日本政策金融公庫融資** ⭐⭐⭐
   - 最大7,200万円（初回500万円申請中）
   - 採択率85%以上、AI企業優遇金利

2. **IT導入補助金2025** ⭐⭐⭐
   - 最大450万円（補助率1/2）
   - セキュリティ対策推進枠は採択率100%

3. **東京都DX推進助成金** ⭐⭐
   - 最大3,000万円（補助率2/3〜4/5）
   - アドバイザー派遣必須（8月申込）

## 🛡️ セキュリティ・コンプライアンス

### セキュリティ機能
- **認証**: 生体認証（Touch ID/Face ID）+ JWT
- **暗号化**: AES-256（保存時）、TLS 1.2+（通信時）
- **監査ログ**: 全操作記録、改ざん防止（ハッシュチェーン）
- **アクセス制御**: ロールベース権限管理（RBAC）

### コンプライアンス対応
- **電子帳簿保存法**: タイムスタンプ24時間以内付与
- **個人情報保護法**: 最小限収集、暗号化保存
- **金融規制**: 多重承認制、取引記録7年保存

## 🏛️ ガバナンス体制

### CEO週次統合リスクレビュー
- **実施日時**: 毎週土曜日 8:00-12:00
- **参加者**: CEO（籾倉丸紀）、相談役（籾倉豊）
- **内容**: 4領域統合評価（戦略KPI、詳細分析、日常運営、自動化）

### リスクマトリクス（重要度順）
1. **資金ショート**（9/9）: 現金残高モニタリング強化
2. **補助金不採択**（6/9）: 複数申請によるリスク分散
3. **システム開発遅延**（4/9）: アジャイル開発で対応
4. **電子帳簿保存法違反**（2/9）: 自動化により対策

## 📚 ドキュメント

詳細なドキュメントは[docs/](./docs/)ディレクトリを参照してください。

- **[ビジネスドキュメント](./docs/business/)**: プロジェクト概要、資金調達戦略、実装計画
- **[技術ドキュメント](./docs/technical/)**: アーキテクチャ、セキュリティ、デプロイメント
- **[API仕様](./docs/api/)**: REST API設計、エンドポイント定義
- **[開発ガイド](./docs/flutter/)**: コーディング規約、ベストプラクティス

## 🤝 貢献方法

現在このプロジェクトはBAYSGAiA社内開発のみで進行しています。

### 開発ルール
1. `feature/`ブランチで機能開発
2. プルリクエスト必須（セルフレビュー可）
3. `flutter analyze`エラーゼロ
4. テストカバレッジ70%以上維持

## 📞 サポート・問い合わせ

- **プロジェクトオーナー**: 代表取締役CEO 籾倉丸紀
- **技術サポート**: [support@baysgaia.com](mailto:support@baysgaia.com)
- **緊急連絡**: CEO直通（Critical Alert発生時）

## 📄 ライセンス

Copyright (c) 2025 BAYSGAiA Inc. All rights reserved.

本ソフトウェアは株式会社ベイスガイアの専有財産です。

---

> **🚀 Phase 2 重要タスク**: GMOあおぞらネット銀行API本番接続、IT導入補助金申請（9/22締切）、基本機能実装完了が最優先事項です。