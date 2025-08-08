# API仕様書

## 概要

BAYSGAiA現金残高最大化プロジェクトのAPIドキュメントです。

## ベースURL

```
開発環境: http://localhost:5000/api
本番環境: https://api.baysgaia-cash-max.com/api
```

## 認証

すべてのAPIエンドポイントには認証が必要です。

```
Authorization: Bearer {access_token}
```

## エンドポイント一覧

### KPI管理

- [GET /api/kpi](./kpi.md#get-kpi) - KPI一覧取得
- [GET /api/kpi/history](./kpi.md#get-kpi-history) - KPI履歴取得
- [POST /api/kpi/calculate](./kpi.md#post-kpi-calculate) - KPI計算実行

### キャッシュフロー

- [GET /api/cashflow/balance](./cashflow.md#get-balance) - 現金残高取得
- [GET /api/cashflow/forecast](./cashflow.md#get-forecast) - 資金予測取得
- [GET /api/cashflow/transactions](./cashflow.md#get-transactions) - 取引履歴取得

### 銀行API連携

- [POST /api/bank/connect](./bank.md#post-connect) - 銀行接続
- [GET /api/bank/accounts](./bank.md#get-accounts) - 口座一覧取得
- [POST /api/bank/transfer](./bank.md#post-transfer) - 振込実行

### 補助金・融資管理

- [GET /api/subsidy](./subsidy.md#get-subsidy) - 補助金一覧取得
- [POST /api/subsidy/apply](./subsidy.md#post-apply) - 補助金申請
- [GET /api/subsidy/status](./subsidy.md#get-status) - 申請状況確認

### プロセス自動化

- [GET /api/process](./process.md#get-process) - プロセス一覧取得
- [POST /api/process/execute](./process.md#post-execute) - プロセス実行
- [GET /api/process/metrics](./process.md#get-metrics) - 効率化指標取得

### リスク管理

- [GET /api/risk](./risk.md#get-risk) - リスク一覧取得
- [POST /api/risk/assess](./risk.md#post-assess) - リスク評価実行
- [GET /api/risk/alerts](./risk.md#get-alerts) - アラート取得

### プロジェクト管理

- [GET /api/project/phases](./project.md#get-phases) - フェーズ一覧取得
- [GET /api/project/tasks](./project.md#get-tasks) - タスク一覧取得
- [PUT /api/project/tasks/{id}](./project.md#put-task) - タスク更新

## エラーレスポンス

すべてのエラーレスポンスは以下の形式で返されます：

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": {}
  }
}
```

### エラーコード一覧

| コード | 説明 |
|--------|------|
| AUTH_ERROR | 認証エラー |
| VALIDATION_ERROR | バリデーションエラー |
| NOT_FOUND | リソースが見つかりません |
| INTERNAL_ERROR | 内部エラー |
| RATE_LIMIT | レート制限 |

## レート制限

- 認証済みユーザー: 1000リクエスト/時間
- 未認証ユーザー: 100リクエスト/時間

レート制限情報はレスポンスヘッダーに含まれます：

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1628856000
```