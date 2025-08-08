# Baysgaia 現金残高最大化プロジェクト

## プロジェクト概要

株式会社ベイスガイアの現金残高最大化を目指す財務改革プロジェクトのダッシュボードシステムです。

### 主要機能

- リアルタイムKPIモニタリング
- 現金残高・キャッシュフロー分析
- GMOあおぞらネット銀行API連携
- AI予測モデルによる資金予測
- アラート・通知機能

## 技術スタック

### バックエンド
- Node.js + TypeScript
- Express.js
- GMOあおぞらネット銀行API

### フロントエンド
- React + TypeScript
- Vite
- TailwindCSS
- Chart.js
- React Query

## セットアップ

### 必要要件
- Node.js 18以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm run install:all

# 環境変数の設定
cp server/.env.example server/.env
# .envファイルを編集してAPI認証情報を設定
```

### 開発サーバーの起動

```bash
# バックエンドとフロントエンドを同時起動
npm run dev
```

- フロントエンド: http://localhost:3000
- バックエンド: http://localhost:5000

### ビルド

```bash
npm run build
```

### リント・型チェック

```bash
npm run lint
npm run typecheck
```

## プロジェクト構造

```
baysgaia-cash-max/
├── server/               # バックエンドAPI
│   ├── src/
│   │   ├── controllers/  # APIコントローラー
│   │   ├── services/     # ビジネスロジック
│   │   ├── routes/       # APIルーティング
│   │   └── utils/        # ユーティリティ
│   └── package.json
├── client/               # フロントエンド
│   ├── src/
│   │   ├── pages/        # ページコンポーネント
│   │   ├── components/   # UIコンポーネント
│   │   ├── api/          # API通信
│   │   └── App.tsx
│   └── package.json
└── package.json          # ルートパッケージ
```

## GMOあおぞらネット銀行API連携

### 利用API
- 残高照会API
- 入出金明細照会API
- 振込状況照会API

### セキュリティ
- OAuth2.0認証
- HTTPS通信（TLS1.2以上）
- アクセストークンの定期更新

## 実装フェーズ

- **Phase 2（現在）**: 簡易ダッシュボード構築
- **Phase 3**: リアルタイムモニタリング実装
- **Phase 4**: AI/ML統合

## ライセンス

Copyright (c) 2025 Baysgaia Inc. All rights reserved.