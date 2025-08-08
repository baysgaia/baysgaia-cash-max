# リスク管理API仕様書

## 概要

BAYSGAiA財務改革システムにおけるリスク管理機能のAPI仕様書です。CEO主導の統合リスク管理体制を支援し、3×3リスクマトリクスによる可視化と早期警戒を実現します。

## エンドポイント一覧

### 1. リスク一覧取得

```
GET /api/risk/list
```

**クエリパラメータ:**
- `category`: カテゴリ（financial, operational, compliance, strategic）
- `severity`: 深刻度（low, medium, high, critical）
- `status`: 状態（identified, monitoring, mitigated, resolved）

**レスポンス例:**
```json
{
  "risks": [
    {
      "id": "RISK001",
      "title": "売掛金回収遅延リスク",
      "category": "financial",
      "probability": 0.3,
      "impact": 0.8,
      "riskScore": 24,
      "severity": "high",
      "status": "monitoring",
      "owner": "CFO",
      "lastAssessment": "2025-08-05T10:00:00+09:00",
      "trend": "increasing",
      "earlyWarnings": {
        "triggered": true,
        "indicators": ["DSO 10%増加", "大口顧客支払遅延"]
      }
    }
  ],
  "summary": {
    "totalRisks": 15,
    "criticalRisks": 2,
    "highRisks": 5,
    "riskAppetite": 0.65,
    "currentExposure": 0.72
  }
}
```

### 2. リスクマトリクス取得

```
GET /api/risk/matrix
```

**レスポンス例:**
```json
{
  "matrix": {
    "high": {
      "high": [
        {
          "id": "RISK001",
          "title": "売掛金回収遅延",
          "score": 81,
          "mitigation": "active"
        }
      ],
      "medium": [
        {
          "id": "RISK003",
          "title": "為替変動リスク",
          "score": 54
        }
      ],
      "low": []
    },
    "medium": {
      "high": [
        {
          "id": "RISK002",
          "title": "キーパーソン依存",
          "score": 36
        }
      ],
      "medium": [],
      "low": []
    },
    "low": {
      "high": [],
      "medium": [],
      "low": [
        {
          "id": "RISK005",
          "title": "軽微なシステム障害",
          "score": 4
        }
      ]
    }
  },
  "thresholds": {
    "critical": 64,
    "high": 36,
    "medium": 16,
    "low": 0
  }
}
```

### 3. リスク詳細取得

```
GET /api/risk/:id
```

**レスポンス例:**
```json
{
  "id": "RISK001",
  "title": "売掛金回収遅延リスク",
  "description": "主要顧客からの売掛金回収が遅延し、キャッシュフローに影響を与えるリスク",
  "category": "financial",
  "assessment": {
    "probability": 0.3,
    "impact": 0.8,
    "velocity": "medium",
    "persistence": "temporary",
    "assessedBy": "CEO",
    "assessmentDate": "2025-08-05",
    "nextReview": "2025-08-19"
  },
  "impactDetails": {
    "financial": {
      "worstCase": 5000000,
      "likelyCase": 2000000,
      "bestCase": 500000
    },
    "operational": "資金繰り悪化による投資計画遅延",
    "strategic": "成長戦略への影響"
  },
  "rootCauses": [
    "顧客企業の業績悪化",
    "請求プロセスの非効率性",
    "与信管理の不備"
  ],
  "earlyWarningIndicators": [
    {
      "indicator": "DSO（売上債権回収日数）",
      "threshold": 45,
      "current": 52,
      "status": "triggered"
    },
    {
      "indicator": "支払遅延件数",
      "threshold": 5,
      "current": 7,
      "status": "triggered"
    }
  ],
  "mitigationPlan": {
    "status": "in_progress",
    "actions": [
      {
        "id": "MIT001",
        "action": "与信限度額の見直し",
        "owner": "CFO",
        "deadline": "2025-08-15",
        "status": "completed"
      },
      {
        "id": "MIT002",
        "action": "早期回収インセンティブ導入",
        "owner": "営業部長",
        "deadline": "2025-08-20",
        "status": "in_progress"
      }
    ],
    "effectiveness": 0.65
  }
}
```

### 4. リスク評価更新

```
PUT /api/risk/:id/assessment
```

**リクエストボディ:**
```json
{
  "probability": 0.4,
  "impact": 0.7,
  "velocity": "high",
  "notes": "大口顧客Aの支払遅延が確認されたため確率を上方修正",
  "reviewedBy": "CEO"
}
```

### 5. 早期警戒指標（EWI）設定

```
POST /api/risk/:id/indicators
```

**リクエストボディ:**
```json
{
  "indicators": [
    {
      "name": "現金残高",
      "type": "threshold",
      "condition": "less_than",
      "value": 5000000,
      "frequency": "daily",
      "alertLevel": "critical"
    },
    {
      "name": "DSO変化率",
      "type": "change_rate",
      "condition": "increase",
      "value": 0.1,
      "period": "week",
      "alertLevel": "warning"
    }
  ]
}
```

### 6. リスク対策計画

```
POST /api/risk/:id/mitigation
```

**リクエストボディ:**
```json
{
  "strategy": "reduce",
  "actions": [
    {
      "title": "債権保証保険の導入",
      "description": "主要顧客の売掛金に対する保証保険加入",
      "cost": 200000,
      "expectedReduction": 0.5,
      "timeline": "2025-09-01",
      "owner": "CFO"
    }
  ],
  "contingencyPlan": {
    "trigger": "DSO > 60日",
    "actions": ["緊急資金調達", "支払条件再交渉"]
  }
}
```

### 7. リスクレポート生成

```
GET /api/risk/reports/executive
```

**レスポンス例:**
```json
{
  "reportDate": "2025-08-08",
  "executiveSummary": {
    "overallRiskLevel": "elevated",
    "keyRisks": 3,
    "newRisks": 1,
    "resolvedRisks": 2,
    "complianceStatus": "compliant"
  },
  "topRisks": [
    {
      "rank": 1,
      "risk": "売掛金回収遅延",
      "change": "increased",
      "requiredAction": "CEO承認必要"
    }
  ],
  "riskTrends": {
    "financial": "increasing",
    "operational": "stable",
    "compliance": "decreasing",
    "strategic": "stable"
  },
  "recommendations": [
    {
      "priority": "high",
      "recommendation": "与信管理プロセスの全面見直し",
      "estimatedImpact": "リスクスコア20%削減",
      "requiredInvestment": 500000
    }
  ]
}
```

### 8. コンプライアンスチェック

```
GET /api/risk/compliance/check
```

**レスポンス例:**
```json
{
  "complianceStatus": "partially_compliant",
  "lastCheck": "2025-08-08T09:00:00+09:00",
  "requirements": [
    {
      "regulation": "電子帳簿保存法",
      "status": "compliant",
      "details": "タイムスタンプ機能実装済み",
      "nextReview": "2025-12-01"
    },
    {
      "regulation": "個人情報保護法",
      "status": "action_required",
      "issues": ["プライバシーポリシー更新必要"],
      "deadline": "2025-08-31"
    }
  ],
  "certifications": [
    {
      "name": "SECURITY ACTION",
      "level": "★★",
      "validUntil": "2026-03-31",
      "renewalRequired": false
    }
  ]
}
```

### 9. リスクアラート履歴

```
GET /api/risk/alerts/history
```

**レスポンス例:**
```json
{
  "alerts": [
    {
      "id": "ALERT001",
      "timestamp": "2025-08-08T08:30:00+09:00",
      "riskId": "RISK001",
      "severity": "critical",
      "trigger": "DSO 60日超過",
      "message": "売上債権回収日数が危険水準に到達",
      "recipients": ["CEO", "CFO"],
      "actionTaken": "緊急対策会議招集",
      "resolved": false
    }
  ],
  "statistics": {
    "last30Days": {
      "totalAlerts": 12,
      "criticalAlerts": 2,
      "averageResponseTime": 2.5,
      "falsePositiveRate": 0.08
    }
  }
}
```

## 通知・エスカレーション

### 10. エスカレーションルール設定

```
POST /api/risk/escalation
```

**リクエストボディ:**
```json
{
  "rules": [
    {
      "condition": "severity == 'critical'",
      "actions": [
        {
          "type": "notify",
          "recipients": ["CEO"],
          "method": ["email", "sms"],
          "immediacy": "immediate"
        },
        {
          "type": "meeting",
          "participants": ["CEO", "CFO", "相談役"],
          "timing": "within_24_hours"
        }
      ]
    }
  ]
}
```

## セキュリティ要件

- CEO/経営層のみアクセス可能な機密情報
- 全アクセスログの記録
- データ暗号化（AES-256）
- 監査証跡の7年保存

## パフォーマンス要件

- リスクマトリクス表示: < 200ms
- アラート通知: < 30秒
- レポート生成: < 5秒

## 実装状況

| 機能 | Phase 2 | Phase 3 | Phase 4 |
|------|---------|---------|---------|
| 基本リスク管理 | ✅ | - | - |
| 3×3マトリクス | ✅ | - | - |
| EWI設定 | 🚧 | ✅ | - |
| 自動アラート | 🔄 | ✅ | - |
| AI予測 | - | 🔄 | ✅ |
| 統合ダッシュボード | 🚧 | ✅ | ✅ |