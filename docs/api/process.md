# プロセス自動化API仕様書

## 概要

BAYSGAiA財務改革システムにおける業務プロセス自動化機能のAPI仕様書です。70%の自動化率達成を目指し、AI活用による業務効率化を実現します。

## エンドポイント一覧

### 1. プロセス一覧取得

```
GET /api/process/list
```

**クエリパラメータ:**
- `status`: 状態（active, inactive, draft）
- `category`: カテゴリ（finance, sales, procurement）
- `automationLevel`: 自動化レベル（full, partial, manual）

**レスポンス例:**
```json
{
  "processes": [
    {
      "id": "PRC001",
      "name": "売掛金回収プロセス",
      "category": "finance",
      "status": "active",
      "automationLevel": 0.75,
      "lastExecuted": "2025-08-08T09:00:00+09:00",
      "metrics": {
        "averageCompletionTime": 2.5,
        "successRate": 0.95,
        "monthlySavings": 320000
      },
      "steps": {
        "total": 8,
        "automated": 6,
        "manual": 2
      }
    }
  ],
  "summary": {
    "totalProcesses": 12,
    "overallAutomationRate": 0.65,
    "monthlySavings": 1850000,
    "targetAutomationRate": 0.70
  }
}
```

### 2. プロセス詳細取得

```
GET /api/process/:id
```

**レスポンス例:**
```json
{
  "id": "PRC001",
  "name": "売掛金回収プロセス",
  "description": "売掛金の自動回収と督促管理",
  "workflow": {
    "steps": [
      {
        "id": "STEP001",
        "name": "請求書発行",
        "type": "automated",
        "trigger": "月末",
        "action": "請求書自動生成・送信",
        "tools": ["会計システム", "メール自動送信"],
        "averageTime": 0.5,
        "errorRate": 0.01
      },
      {
        "id": "STEP002",
        "name": "入金確認",
        "type": "automated",
        "trigger": "日次",
        "action": "銀行API経由で入金自動照合",
        "tools": ["GMOあおぞら銀行API"],
        "averageTime": 0.2,
        "errorRate": 0.005
      },
      {
        "id": "STEP003",
        "name": "督促判定",
        "type": "automated",
        "trigger": "支払期日+3日",
        "action": "AI判定による督促要否決定",
        "tools": ["AI判定エンジン"],
        "averageTime": 0.1,
        "errorRate": 0.02
      }
    ],
    "connections": [
      {"from": "STEP001", "to": "STEP002", "condition": "always"},
      {"from": "STEP002", "to": "STEP003", "condition": "payment_not_received"}
    ]
  },
  "performance": {
    "totalExecutions": 450,
    "successfulExecutions": 428,
    "averageCompletionTime": 2.5,
    "bottlenecks": [
      {
        "step": "STEP004",
        "issue": "手動承認待ち",
        "averageDelay": 4.2,
        "recommendation": "承認権限の委譲または自動承認ルール設定"
      }
    ]
  }
}
```

### 3. プロセス実行

```
POST /api/process/:id/execute
```

**リクエストボディ:**
```json
{
  "parameters": {
    "targetMonth": "2025-08",
    "customerFilter": "all",
    "executionMode": "production"
  },
  "options": {
    "skipManualSteps": false,
    "notifyOnCompletion": true,
    "dryRun": false
  }
}
```

**レスポンス例:**
```json
{
  "executionId": "EXEC20250808001",
  "status": "running",
  "startedAt": "2025-08-08T10:00:00+09:00",
  "progress": {
    "completedSteps": 3,
    "totalSteps": 8,
    "currentStep": "STEP004",
    "estimatedCompletion": "2025-08-08T10:30:00+09:00"
  }
}
```

### 4. プロセス実行履歴

```
GET /api/process/:id/history
```

**レスポンス例:**
```json
{
  "processId": "PRC001",
  "executions": [
    {
      "executionId": "EXEC20250808001",
      "startedAt": "2025-08-08T10:00:00+09:00",
      "completedAt": "2025-08-08T10:25:00+09:00",
      "status": "completed",
      "results": {
        "invoicesSent": 45,
        "paymentsReceived": 38,
        "remindersScheduled": 7,
        "totalAmount": 12500000
      },
      "errors": []
    }
  ],
  "statistics": {
    "last30Days": {
      "executions": 30,
      "successRate": 0.97,
      "averageProcessingTime": 24.5,
      "costSavings": 960000
    }
  }
}
```

### 5. AI最適化提案

```
GET /api/process/:id/optimization
```

**レスポンス例:**
```json
{
  "processId": "PRC001",
  "currentAutomationRate": 0.75,
  "recommendations": [
    {
      "id": "OPT001",
      "title": "承認プロセスのAI自動化",
      "description": "定型的な承認をAIで自動判定",
      "impact": {
        "automationIncrease": 0.125,
        "timeSaving": 120,
        "monthlySaving": 150000
      },
      "implementation": {
        "effort": "medium",
        "duration": "2週間",
        "requiredTools": ["AI承認エンジン"],
        "cost": 300000
      },
      "roi": 2.5
    },
    {
      "id": "OPT002",
      "title": "例外処理の自動化",
      "description": "頻発する例外パターンの自動処理",
      "impact": {
        "automationIncrease": 0.05,
        "errorReduction": 0.8,
        "timeSaving": 40
      }
    }
  ],
  "projectedAutomationRate": 0.925
}
```

### 6. ワークフロー作成・編集

```
POST /api/process/create
```

**リクエストボディ:**
```json
{
  "name": "支払承認ワークフロー",
  "category": "finance",
  "steps": [
    {
      "name": "支払申請",
      "type": "manual",
      "assignee": "申請者",
      "form": {
        "fields": [
          {"name": "amount", "type": "number", "required": true},
          {"name": "vendor", "type": "text", "required": true},
          {"name": "purpose", "type": "textarea", "required": true}
        ]
      }
    },
    {
      "name": "自動審査",
      "type": "automated",
      "conditions": [
        {"if": "amount <= 100000", "then": "auto_approve"},
        {"if": "amount > 100000", "then": "manual_review"}
      ]
    }
  ],
  "notifications": {
    "onStart": ["applicant"],
    "onComplete": ["applicant", "finance"],
    "onError": ["admin"]
  }
}
```

### 7. プロセス分析ダッシュボード

```
GET /api/process/analytics
```

**レスポンス例:**
```json
{
  "overview": {
    "totalProcesses": 12,
    "activeProcesses": 10,
    "automationRate": 0.65,
    "targetRate": 0.70,
    "gap": 0.05
  },
  "byCategory": {
    "finance": {
      "processes": 5,
      "automationRate": 0.72,
      "monthlySavings": 980000
    },
    "sales": {
      "processes": 4,
      "automationRate": 0.58,
      "monthlySavings": 520000
    },
    "procurement": {
      "processes": 3,
      "automationRate": 0.63,
      "monthlySavings": 350000
    }
  },
  "trends": {
    "monthly": [
      {"month": "2025-06", "rate": 0.45, "savings": 1200000},
      {"month": "2025-07", "rate": 0.55, "savings": 1500000},
      {"month": "2025-08", "rate": 0.65, "savings": 1850000}
    ]
  },
  "projections": {
    "nextMonth": {
      "automationRate": 0.68,
      "expectedSavings": 2050000
    },
    "targetAchievement": "2025-10-15"
  }
}
```

### 8. プロセステンプレート

```
GET /api/process/templates
```

**レスポンス例:**
```json
{
  "templates": [
    {
      "id": "TPL001",
      "name": "標準売掛金回収",
      "category": "finance",
      "description": "中小企業向け売掛金回収の標準テンプレート",
      "automationRate": 0.8,
      "estimatedSavings": 300000,
      "requiredIntegrations": ["銀行API", "会計システム"],
      "customizationOptions": [
        "督促タイミング",
        "承認ルール",
        "通知設定"
      ]
    }
  ]
}
```

## エラーハンドリング

### エラーコード

| コード | 説明 | 対処法 |
|--------|------|--------|
| PRC_001 | プロセス実行中 | 完了まで待機 |
| PRC_002 | 必須パラメータ不足 | パラメータを確認 |
| PRC_003 | 権限不足 | 管理者に権限申請 |
| PRC_004 | 外部システム接続エラー | 接続設定を確認 |

## パフォーマンス指標

- API応答時間: < 300ms（95%tile）
- プロセス実行: < 5分（標準的なワークフロー）
- 同時実行数: 最大50プロセス

## セキュリティ

- ロールベースアクセス制御（RBAC）
- 実行ログの完全記録
- 機密データのマスキング
- 監査証跡の7年保存

## 実装ロードマップ

### Phase 2（現在）
- ✅ 基本ワークフロー実行
- ✅ 売掛金回収自動化
- 🚧 AI承認エンジン
- 🔄 プロセステンプレート

### Phase 3
- ⏳ リアルタイムモニタリング
- ⏳ 高度な例外処理
- ⏳ 外部システム連携強化

### Phase 4
- ⏳ プロセスマイニング
- ⏳ 予測的プロセス最適化
- ⏳ 完全自律型ワークフロー