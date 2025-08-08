# BAYSGAiA 現金残高最大化プロジェクト - Flutter財務改革システム

## プロジェクト概要

BAYSGAiA（株式会社ベイスガイア）の現金残高最大化を目指すFlutterベース財務改革システムです。モバイル・デスクトップ両対応で、AI技術力を活用した財務プロセスの自動化と最適化を実現します。

### プロジェクト背景
- **企業名**: BAYSGAiA（株式会社ベイスガイア）
- **従業員数**: 5名以下（小規模企業の機動性を最大限活用）
- **実施期間**: 2025年8月〜2025年12月（約4ヶ月）
- **目的**: 持続可能なキャッシュフロー最大化による財務基盤の強化
- **アプローチ**: CEO主導による統合リスク管理とAI活用

### システム構成

1. **財務ダッシュボード**: リアルタイムKPIモニタリングと分析
2. **補助金・融資管理**: 公的支援の申請・管理・報告
3. **プロセス自動化**: 業務フローの最適化とAI活用
4. **リスク管理**: 財務リスクの監視とアラート
5. **プロジェクト管理**: 4フェーズ実行計画の進捗管理

## プロジェクトOKR（目標と主要成果）

| KR | 目標 | 期限 | 現状 | ステータス |
|---|------|------|------|------------|
| **KR1** | 月末現金残高 +20% | 3ヶ月以内 | 5.2% | 要改善 |
| **KR2** | キャッシュ転換日数（CCC）-25% | 4ヶ月以内 | 18% | 順調 |
| **KR3** | 売上債権回収日数（DSO）-30% | 2ヶ月以内 | 22% | 順調 |
| **KR4** | 資金予測精度 ≧95% | 2ヶ月以内 | 92.5% | 順調 |
| **KR5** | 資金関連プロセス自動化 70% | 4ヶ月以内 | 35% | 要改善 |

## 技術スタック

### Flutter/Dart
- **Flutter**: 3.10.0以上
- **Dart**: 3.0.0以上

### 主要パッケージ
- **状態管理**: Riverpod 2.4.9
- **ルーティング**: GoRouter 12.1.3
- **HTTP通信**: Dio 5.4.0
- **データ保存**: Hive 2.2.3 + Flutter Secure Storage 9.0.0
- **チャート**: FL Chart 0.65.0 + Syncfusion Charts 23.2.6
- **国際化**: Intl 0.19.0

### アーキテクチャ
- **パターン**: Clean Architecture + MVVM
- **状態管理**: Riverpod Provider Pattern
- **データレイヤー**: Repository Pattern + API Service
- **UIレイヤー**: Responsive Design (Mobile/Tablet/Desktop)

## セットアップ

### 必要要件
- Flutter 3.10.0以上
- Dart 3.0.0以上
- Android Studio / VS Code
- Xcode（iOS開発時）

### インストール

```bash
# リポジトリクローン
git clone git@github.com:baysgaia/baysgaia-cash-max.git
cd baysgaia-cash-max

# Flutter依存関係取得
flutter pub get

# コード生成（必要な場合）
flutter packages pub run build_runner build

# デバッグビルド実行
flutter run
```

### 環境設定

```bash
# 環境変数ファイル作成（本番環境では必要な設定を追加）
# lib/core/config/app_config.dart で設定を管理
```

## 開発・ビルドコマンド

```bash
# 開発サーバー起動（ホットリロード）
flutter run

# デバッグビルド
flutter build apk --debug    # Android
flutter build ios --debug    # iOS

# リリースビルド
flutter build apk --release  # Android
flutter build ios --release  # iOS
flutter build web            # Web
flutter build macos          # macOS
flutter build windows        # Windows

# テスト実行
flutter test

# コード解析
flutter analyze

# 依存関係更新
flutter pub upgrade
```

## プロジェクト構造

```
lib/
├── app/                          # アプリケーション設定
│   ├── app.dart                  # メインアプリウィジェット
│   └── router/                   # ルーティング設定
│       └── app_router.dart
├── core/                         # コア機能
│   ├── constants/                # 定数定義
│   ├── theme/                    # テーマ設定
│   ├── services/                 # 共通サービス
│   ├── utils/                    # ユーティリティ
│   └── config/                   # 設定管理
├── features/                     # 機能別実装
│   ├── auth/                     # 認証機能
│   ├── dashboard/                # ダッシュボード
│   ├── kpi/                      # KPI管理
│   ├── cashflow/                 # キャッシュフロー分析
│   ├── subsidy/                  # 補助金・融資管理
│   ├── process/                  # プロセス自動化
│   ├── risk/                     # リスク管理
│   ├── project/                  # プロジェクト管理
│   └── settings/                 # 設定画面
├── shared/                       # 共通ウィジェット・ユーティリティ
│   ├── widgets/                  # 共通ウィジェット
│   ├── models/                   # データモデル
│   └── providers/                # 共通プロバイダー
└── main.dart                     # エントリーポイント
```

### 各機能の実装状況

| 機能 | 画面実装 | API連携 | テスト | 状態 |
|------|----------|---------|--------|------|
| 認証システム | ✅ | 🚧 | 🔄 | Phase 2 |
| ダッシュボード | ✅ | ✅ | ✅ | Phase 2 |
| KPI詳細分析 | ✅ | ✅ | 🚧 | Phase 2 |
| キャッシュフロー分析 | ✅ | 🚧 | 🔄 | Phase 2 |
| 補助金・融資管理 | ✅ | 🚧 | 🔄 | Phase 2 |
| プロセス自動化 | 🚧 | 🔄 | ❌ | Phase 3 |
| リスク管理 | 🚧 | 🔄 | ❌ | Phase 3 |
| プロジェクト管理 | ✅ | ✅ | 🚧 | Phase 2 |

## プロジェクトフェーズ

### Phase 1: 基盤構築（Week 0-3）✓ 完了
- 現状分析とKPIベースライン策定
- GMOあおぞらネット銀行API接続PoC（sunabar環境）
- 緊急資金調達計画策定（日本政策金融公庫融資）

### Phase 2: システム導入（Week 4-7）🔄 実施中
- Flutterアプリケーション開発
- 基本ダッシュボード・KPI管理機能実装
- IT導入補助金申請（第5次：9月22日締切）
- 売掛金管理パイロット実装

#### Phase 2 重点実装項目
1. ダッシュボード画面の完成
2. KPI詳細分析機能
3. リアルタイムデータ表示
4. アラート通知システム

### Phase 3: プロセス変革（Week 8-11）📅 予定
- 業務プロセス最適化（70%自動化目標）
- リアルタイムモニタリング機能
- AI予測モデル統合
- 異常検知システム実装

### Phase 4: 最適化＆拡張（Week 12-16）📅 予定
- 高度な分析機能（What-if分析、シナリオプランニング）
- 外部データ統合（市場データ、経済指標）
- マルチプラットフォーム対応強化
- API提供準備

## 主要機能

### 財務ダッシュボード
- リアルタイムKPIモニタリング（CCC、DSO、DPO）
- 現金残高・キャッシュフロー推移チャート
- AI予測による資金予測（精度95%以上目標）
- ROI分析とパフォーマンス指標

### GMOあおぞらネット銀行API連携
- OAuth2.0認証による安全な接続
- 自動入出金明細取得
- リアルタイム残高確認
- 取引履歴の自動同期

### 補助金・融資管理
- 申請状況追跡とタスク管理
- 必要書類の管理・提出支援
- 実績報告の自動生成
- 資金調達シミュレーション

### プロセス自動化
- 売掛金回収プロセス最適化
- 支払承認ワークフロー
- 自動レポート生成
- 効率化分析とROI測定

### リスク管理
- リスクモニタリング（3x3マトリクス）
- EWI（早期警戒指標）アラート
- コンプライアンスチェック
- 監査証跡管理

## CEO週次統合リスクレビュー
- **実施日**: 毎週土曜日 8:00
- **参加者**: CEO（籾倉丸紀）、相談役
- **アジェンダ**: 
  - KPI進捗レビュー（5指標）
  - リスクマトリクス評価
  - Quick Win施策進捗
  - 次週アクションプラン

### CEO月次経営報告
- **実施日**: 月末経営会議
- **内容**: 
  - OKR達成状況分析
  - 財務指標トレンド分析
  - 補助金・融資進捗報告
  - 投資対効果（ROI）評価
  - 次月重点施策決定

## 資金調達目標と申請スケジュール

### 優先順位別資金調達計画（総額最大1億5,050万円）

1. **日本政策金融公庫融資**（最優先）
   - 申請額：初回500万円（段階的拡大戦略）
   - 申請時期：即時申請可能
   - 所要期間：最短2週間

2. **IT導入補助金2025**（高優先）
   - 申請額：最大450万円
   - 第5次締切：2025年9月22日
   - 採択率：60-80%

3. **東京都DX推進助成金**（中優先）
   - 申請額：最大3,000万円
   - アドバイザー派遣：8月中申込必須
   - 審査期間：2-3ヶ月

## セキュリティとコンプライアンス

### 必須対応事項
- **電子帳簿保存法対応**
  - タイムスタンプ付与
  - 検索要件充足
  - 7年間保存体制

- **セキュリティ要件**
  - 多要素認証（MFA）
  - データ暗号化（保存時・通信時）
  - 監査ログ完全記録
  - 24時間365日監視体制

### データプライバシー
- 最小限の個人情報収集
- 暗号化による保護
- アクセス権限管理
- GDPR準拠設計

## テスト戦略

```bash
# 単体テスト
flutter test

# 統合テスト
flutter test integration_test/

# ウィジェットテスト
flutter test test/widgets/

# パフォーマンステスト
flutter driver --target=test_driver/perf_test.dart
```

## CI/CD設定

### GitHub Actions（予定）
- 自動ビルド・テスト実行
- コード品質チェック
- セキュリティスキャン
- 自動デプロイ

## 関連ドキュメント

### プロジェクトドキュメント（`_ProjectNotes/`）
- **プロジェクト全体像**: `Outline_20250807-baysgaia-cash-max.md`
- **財務指標定義**: `Financial_Metrics_KPIs.md`
- **実装ロードマップ**: `Implementation_Roadmap.md`
- **ダッシュボード仕様**: `ROI_Dashboard_Specifications.md`
- **補助金・融資計画**: `Government_Support_Plan.md`
- **リスク管理**: `Risk_Management_Governance.md`

### 技術ドキュメント（`docs/`）
- **API仕様**: `/docs/api/`
- **アーキテクチャ**: `/docs/technical/`
- **ユーザーガイド**: `/docs/user/`

## サポート・問い合わせ

- **プロジェクトオーナー**: 代表取締役CEO 籾倉丸紀
- **技術サポート**: [support@baysgaia.com](mailto:support@baysgaia.com)
- **緊急連絡先**: CEO直通（Critical Alert発生時）

## ライセンス

Copyright (c) 2025 BAYSGAiA Inc. All rights reserved.

---

> **Phase 2 重要メモ**: 現在システム導入フェーズ実行中。GMOあおぞらネット銀行API本番接続準備、IT導入補助金申請（9/22締切）、基本ダッシュボード完成が最優先事項。