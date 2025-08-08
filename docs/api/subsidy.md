# 補助金・融資管理API仕様書

## 概要

BAYSGAiA財務改革システムにおける補助金・融資管理機能のAPI仕様書です。公的支援制度の申請から実績報告まで一元管理します。

## エンドポイント一覧

### 1. 補助金・融資一覧取得

```
GET /api/subsidy/list
```

**クエリパラメータ:**
- `status`: 申請状況（planning, applying, approved, rejected, completed）
- `type`: 種別（subsidy, loan, grant）
- `sort`: ソート順（deadline, amount, priority）

**レスポンス例:**
```json
{
  "subsidies": [
    {
      "id": "SUB001",
      "name": "IT導入補助金2025",
      "type": "subsidy",
      "status": "applying",
      "priority": "high",
      "maxAmount": 4500000,
      "subsidyRate": 0.667,
      "deadline": "2025-09-22",
      "progress": 0.6,
      "estimatedProbability": 0.75,
      "requiredDocuments": {
        "total": 12,
        "completed": 8
      }
    }
  ],
  "totalPotentialAmount": 150500000,
  "activeApplications": 3
}
```

### 2. 補助金詳細情報取得

```
GET /api/subsidy/:id
```

**レスポンス例:**
```json
{
  "id": "SUB001",
  "name": "IT導入補助金2025",
  "details": {
    "organizationName": "独立行政法人中小企業基盤整備機構",
    "programOverview": "中小企業のデジタル化支援",
    "eligibility": {
      "companySize": "中小企業・小規模事業者",
      "industry": "全業種",
      "requirements": [
        "gBizIDプライム取得",
        "SECURITY ACTION宣言",
        "ITツール導入計画"
      ]
    },
    "financialDetails": {
      "maxAmount": 4500000,
      "minAmount": 300000,
      "subsidyRate": "2/3",
      "ownFundsRequired": 1500000
    },
    "timeline": {
      "applicationStart": "2025-08-01",
      "applicationEnd": "2025-09-22",
      "resultAnnouncement": "2025-10-15",
      "projectStart": "2025-10-20",
      "projectEnd": "2026-03-31",
      "reportDeadline": "2026-04-30"
    }
  },
  "applicationStatus": {
    "currentPhase": "書類準備",
    "completedSteps": [
      "gBizID取得",
      "事業計画書作成",
      "見積書取得"
    ],
    "nextSteps": [
      "SECURITY ACTION宣言",
      "申請書類最終確認"
    ],
    "estimatedCompletionDate": "2025-09-15"
  }
}
```

### 3. 申請書類管理

```
GET /api/subsidy/:id/documents
```

**レスポンス例:**
```json
{
  "subsidyId": "SUB001",
  "documents": [
    {
      "id": "DOC001",
      "name": "事業計画書",
      "type": "required",
      "status": "completed",
      "uploadedAt": "2025-08-05T10:00:00+09:00",
      "fileSize": 2048000,
      "reviewer": "CEO",
      "notes": "KPI目標を明確に記載済み"
    },
    {
      "id": "DOC002",
      "name": "見積書（システム開発）",
      "type": "required",
      "status": "completed",
      "uploadedAt": "2025-08-06T14:30:00+09:00",
      "vendor": "BAYSGAiA自社開発",
      "amount": 3000000
    },
    {
      "id": "DOC003",
      "name": "SECURITY ACTION宣言書",
      "type": "required",
      "status": "pending",
      "dueDate": "2025-09-10",
      "template": "/templates/security_action.pdf"
    }
  ],
  "completionRate": 0.75,
  "missingDocuments": [
    "SECURITY ACTION宣言書",
    "直近決算書"
  ]
}
```

### 4. 申請書類アップロード

```
POST /api/subsidy/:id/documents
```

**リクエスト:**
```
Content-Type: multipart/form-data

documentType: business_plan
file: [binary data]
notes: 財務改革プロジェクトの詳細計画を含む
```

### 5. 資金調達シミュレーション

```
POST /api/subsidy/simulation
```

**リクエストボディ:**
```json
{
  "subsidies": [
    {
      "id": "SUB001",
      "applicationAmount": 4500000,
      "probability": 0.75
    },
    {
      "id": "LOAN001",
      "applicationAmount": 5000000,
      "probability": 0.90
    }
  ],
  "timeline": {
    "start": "2025-08",
    "end": "2025-12"
  }
}
```

**レスポンス例:**
```json
{
  "simulation": {
    "expectedTotalAmount": 7875000,
    "worstCase": 4500000,
    "bestCase": 9500000,
    "cashflowProjection": [
      {
        "month": "2025-10",
        "inflow": 5000000,
        "source": "日本政策金融公庫融資"
      },
      {
        "month": "2025-11",
        "inflow": 3000000,
        "source": "IT導入補助金（前払い）"
      }
    ],
    "requiredOwnFunds": 2500000,
    "roi": 7.75
  }
}
```

### 6. 実績報告管理

```
POST /api/subsidy/:id/report
```

**リクエストボディ:**
```json
{
  "reportType": "progress",
  "period": "2025-Q4",
  "achievements": [
    {
      "kpi": "プロセス自動化率",
      "target": 50,
      "actual": 55,
      "evidence": "/reports/automation_report_202512.pdf"
    }
  ],
  "expenses": [
    {
      "category": "システム開発費",
      "plannedAmount": 3000000,
      "actualAmount": 2800000,
      "invoices": ["INV001", "INV002"]
    }
  ]
}
```

### 7. 補助金カレンダー

```
GET /api/subsidy/calendar
```

**レスポンス例:**
```json
{
  "upcomingDeadlines": [
    {
      "date": "2025-09-10",
      "items": [
        {
          "subsidyId": "SUB001",
          "name": "IT導入補助金",
          "task": "SECURITY ACTION宣言提出",
          "priority": "high"
        }
      ]
    },
    {
      "date": "2025-09-22",
      "items": [
        {
          "subsidyId": "SUB001",
          "name": "IT導入補助金",
          "task": "申請締切",
          "priority": "critical"
        }
      ]
    }
  ],
  "monthlyTasks": {
    "2025-09": 8,
    "2025-10": 5,
    "2025-11": 3
  }
}
```

### 8. 自動マッチング

```
GET /api/subsidy/recommendations
```

**レスポンス例:**
```json
{
  "recommendations": [
    {
      "id": "SUB004",
      "name": "東京都DX推進支援事業",
      "matchScore": 0.92,
      "reasons": [
        "AI活用による業務効率化が対象",
        "従業員5名以下の優遇措置あり",
        "最大3000万円の大型支援"
      ],
      "estimatedAmount": 20000000,
      "deadline": "2025-10-31",
      "action": "アドバイザー派遣申込（8月中必須）"
    }
  ]
}
```

## 通知・アラートAPI

### 9. 期限アラート設定

```
POST /api/subsidy/alerts
```

**リクエストボディ:**
```json
{
  "subsidyId": "SUB001",
  "alerts": [
    {
      "type": "deadline",
      "daysBefore": 30,
      "recipients": ["ceo@baysgaia.com"]
    },
    {
      "type": "document_missing",
      "daysBefore": 14,
      "recipients": ["admin@baysgaia.com"]
    }
  ]
}
```

## エラーコード

| コード | 説明 | 対処法 |
|--------|------|--------|
| SUB_001 | 補助金情報が見つかりません | IDを確認してください |
| SUB_002 | 書類アップロード失敗 | ファイルサイズ・形式を確認 |
| SUB_003 | 申請期限切れ | 次回募集をお待ちください |
| SUB_004 | 必須書類不足 | 不足書類を確認し提出 |

## 実装状況

| 機能 | API | UI | 統合テスト |
|------|-----|----|-----------| 
| 補助金一覧・検索 | ✅ | ✅ | ✅ |
| 申請進捗管理 | ✅ | ✅ | ✅ |
| 書類管理 | ✅ | 🚧 | 🔄 |
| 資金調達シミュレーション | ✅ | ✅ | ✅ |
| 実績報告 | 🚧 | 🔄 | ❌ |
| 自動マッチング | 🔄 | ❌ | ❌ |

## セキュリティ要件

- 全ての書類は暗号化して保存
- アクセスログの完全記録
- 役職別アクセス制御
- 電子帳簿保存法準拠