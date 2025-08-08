# キャッシュフローAPI仕様書

## 概要

BAYSGAiA財務改革システムにおけるキャッシュフロー分析・予測APIの仕様書です。

## エンドポイント一覧

### 1. キャッシュフロー実績取得

```
GET /api/cashflow/actual
```

**クエリパラメータ:**
- `startDate`: 開始日（YYYY-MM-DD）
- `endDate`: 終了日（YYYY-MM-DD）
- `period`: 期間（daily, weekly, monthly）

**レスポンス例:**
```json
{
  "period": "monthly",
  "cashflows": [
    {
      "date": "2025-08",
      "operatingCashflow": 3500000,
      "investingCashflow": -500000,
      "financingCashflow": 1000000,
      "netCashflow": 4000000,
      "beginningBalance": 10000000,
      "endingBalance": 14000000,
      "details": {
        "revenue": 5000000,
        "expenses": -1500000,
        "workingCapitalChange": 0
      }
    }
  ]
}
```

### 2. キャッシュフロー予測

```
GET /api/cashflow/forecast
```

**クエリパラメータ:**
- `forecastPeriod`: 予測期間（日数）
- `scenario`: シナリオ（optimistic, realistic, pessimistic）

**レスポンス例:**
```json
{
  "forecastPeriod": 90,
  "scenario": "realistic",
  "accuracy": 92.5,
  "forecasts": [
    {
      "date": "2025-09",
      "predictedCashflow": 3800000,
      "confidenceInterval": {
        "lower": 3200000,
        "upper": 4400000
      },
      "predictedBalance": 17800000,
      "riskFactors": [
        {
          "factor": "売掛金回収遅延",
          "impact": -500000,
          "probability": 0.2
        }
      ]
    }
  ]
}
```

### 3. 運転資本分析

```
GET /api/cashflow/working-capital
```

**レスポンス例:**
```json
{
  "currentDate": "2025-08-08",
  "workingCapital": 8500000,
  "components": {
    "accountsReceivable": 12000000,
    "inventory": 3000000,
    "accountsPayable": 6500000
  },
  "ratios": {
    "currentRatio": 2.31,
    "quickRatio": 1.85,
    "cashRatio": 1.23
  },
  "trends": {
    "monthlyChange": 0.05,
    "yearlyChange": 0.15
  }
}
```

### 4. キャッシュバーン率分析

```
GET /api/cashflow/burn-rate
```

**レスポンス例:**
```json
{
  "period": "2025-08",
  "monthlyBurnRate": 1500000,
  "runway": 9.3,
  "breakdown": {
    "personnel": 800000,
    "operations": 400000,
    "marketing": 200000,
    "other": 100000
  },
  "trend": {
    "3monthAverage": 1450000,
    "6monthAverage": 1400000,
    "direction": "increasing"
  }
}
```

### 5. What-if分析

```
POST /api/cashflow/what-if
```

**リクエストボディ:**
```json
{
  "scenarios": [
    {
      "name": "売上20%増加",
      "parameters": {
        "revenueMultiplier": 1.2,
        "expenseMultiplier": 1.1,
        "collectionPeriod": 45
      }
    }
  ],
  "forecastPeriod": 180
}
```

**レスポンス例:**
```json
{
  "scenarios": [
    {
      "name": "売上20%増加",
      "impact": {
        "cashflowChange": 2500000,
        "endingBalance": 16500000,
        "runwayChange": 2.5
      },
      "monthlyProjections": [
        {
          "month": "2025-09",
          "cashflow": 4200000,
          "balance": 18200000
        }
      ]
    }
  ]
}
```

## アラート設定API

### 6. キャッシュフローアラート設定

```
POST /api/cashflow/alerts
```

**リクエストボディ:**
```json
{
  "alertType": "LOW_BALANCE",
  "threshold": 5000000,
  "notificationChannels": ["email", "dashboard"],
  "recipients": ["ceo@baysgaia.com"],
  "frequency": "daily"
}
```

### 7. アラート履歴取得

```
GET /api/cashflow/alerts/history
```

**レスポンス例:**
```json
{
  "alerts": [
    {
      "alertId": "ALT20250808001",
      "type": "NEGATIVE_CASHFLOW",
      "triggeredAt": "2025-08-08T09:00:00+09:00",
      "severity": "WARNING",
      "message": "今月の営業キャッシュフローが前月比-15%",
      "actionTaken": "CEO通知済み",
      "resolved": false
    }
  ]
}
```

## 統計・分析API

### 8. キャッシュフロー統計

```
GET /api/cashflow/statistics
```

**レスポンス例:**
```json
{
  "period": "2025",
  "statistics": {
    "averageMonthlyCashflow": 3500000,
    "volatility": 0.25,
    "bestMonth": {
      "month": "2025-06",
      "cashflow": 5200000
    },
    "worstMonth": {
      "month": "2025-02",
      "cashflow": 1800000
    },
    "seasonality": {
      "Q1": 0.85,
      "Q2": 1.10,
      "Q3": 0.95,
      "Q4": 1.10
    }
  }
}
```

## エラーハンドリング

### エラーレスポンス形式

```json
{
  "error": {
    "code": "INSUFFICIENT_DATA",
    "message": "予測に必要なデータが不足しています",
    "details": {
      "requiredPeriod": 90,
      "availablePeriod": 60
    }
  }
}
```

## パフォーマンス要件

- レスポンスタイム: < 500ms（95パーセンタイル）
- 同時接続数: 100
- データ更新頻度: リアルタイム（銀行API連携時）

## セキュリティ

- JWT認証必須
- API Rate Limiting: 100 requests/minute
- データ暗号化: AES-256
- 監査ログ: 全APIアクセスを記録

## 実装ノート

### 予測モデル

現在実装されている予測モデル:
- **時系列分析**: ARIMA, Prophet
- **機械学習**: XGBoost, Random Forest
- **アンサンブル**: 複数モデルの重み付け平均

### データソース

- GMOあおぞらネット銀行API（メイン）
- 会計システム連携（サブ）
- 手動入力データ（補助）

## 今後の拡張予定

1. **Phase 3（Week 8-11）**
   - リアルタイムストリーミングAPI
   - 高度な異常検知
   - 外部データ統合（市場データ）

2. **Phase 4（Week 12-16）**
   - GraphQL API対応
   - WebSocket通知
   - モバイルSDK提供