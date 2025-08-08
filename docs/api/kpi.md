# KPI API

## GET /api/kpi

現在のKPI値一覧を取得します。

### リクエスト

```http
GET /api/kpi
Authorization: Bearer {access_token}
```

### レスポンス

```json
{
  "kpis": [
    {
      "id": "cash_balance",
      "name": "現金残高",
      "value": 5000000,
      "unit": "円",
      "target": 6000000,
      "achievement_rate": 83.3,
      "trend": "up",
      "last_updated": "2025-08-08T10:00:00Z"
    },
    {
      "id": "ccc",
      "name": "キャッシュ転換日数",
      "value": 45,
      "unit": "日",
      "target": 35,
      "achievement_rate": 77.8,
      "trend": "down",
      "last_updated": "2025-08-08T10:00:00Z"
    },
    {
      "id": "dso",
      "name": "売上債権回収日数",
      "value": 42,
      "unit": "日",
      "target": 30,
      "achievement_rate": 71.4,
      "trend": "down",
      "last_updated": "2025-08-08T10:00:00Z"
    },
    {
      "id": "forecast_accuracy",
      "name": "資金予測精度",
      "value": 92.5,
      "unit": "%",
      "target": 95,
      "achievement_rate": 97.4,
      "trend": "up",
      "last_updated": "2025-08-08T10:00:00Z"
    },
    {
      "id": "automation_rate",
      "name": "プロセス自動化率",
      "value": 55,
      "unit": "%",
      "target": 70,
      "achievement_rate": 78.6,
      "trend": "up",
      "last_updated": "2025-08-08T10:00:00Z"
    }
  ]
}
```

## GET /api/kpi/history

KPIの履歴データを取得します。

### リクエスト

```http
GET /api/kpi/history?kpi_id=ccc&period=30d
Authorization: Bearer {access_token}
```

### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| kpi_id | string | はい | KPI ID |
| period | string | いいえ | 期間（7d, 30d, 90d, 1y）デフォルト: 30d |
| interval | string | いいえ | 集計間隔（daily, weekly, monthly）デフォルト: daily |

### レスポンス

```json
{
  "kpi_id": "ccc",
  "name": "キャッシュ転換日数",
  "period": "30d",
  "interval": "daily",
  "data": [
    {
      "date": "2025-07-09",
      "value": 52,
      "target": 35
    },
    {
      "date": "2025-07-10",
      "value": 51,
      "target": 35
    },
    {
      "date": "2025-08-08",
      "value": 45,
      "target": 35
    }
  ],
  "summary": {
    "average": 48.5,
    "min": 45,
    "max": 52,
    "improvement": -13.5,
    "improvement_rate": -26.0
  }
}
```

## POST /api/kpi/calculate

KPIの再計算を実行します。

### リクエスト

```http
POST /api/kpi/calculate
Authorization: Bearer {access_token}
Content-Type: application/json
```

```json
{
  "kpi_ids": ["ccc", "dso", "dpo"],
  "date_range": {
    "start": "2025-07-01",
    "end": "2025-08-08"
  }
}
```

### パラメータ

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| kpi_ids | array | いいえ | 計算するKPI ID配列（省略時は全KPI） |
| date_range | object | いいえ | 計算期間（省略時は現在） |

### レスポンス

```json
{
  "status": "success",
  "calculated_kpis": [
    {
      "id": "ccc",
      "previous_value": 48,
      "new_value": 45,
      "change": -3,
      "change_rate": -6.25
    },
    {
      "id": "dso",
      "previous_value": 45,
      "new_value": 42,
      "change": -3,
      "change_rate": -6.67
    },
    {
      "id": "dpo",
      "previous_value": 28,
      "new_value": 30,
      "change": 2,
      "change_rate": 7.14
    }
  ],
  "calculation_time": "2025-08-08T10:15:30Z"
}
```

## エラーレスポンス

### 400 Bad Request

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "無効なKPI IDが指定されました",
    "details": {
      "invalid_kpi_ids": ["invalid_id"]
    }
  }
}
```

### 401 Unauthorized

```json
{
  "error": {
    "code": "AUTH_ERROR",
    "message": "認証トークンが無効です"
  }
}
```