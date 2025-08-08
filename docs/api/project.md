# プロジェクト管理API仕様書

## 概要

BAYSGAiA財務改革プロジェクトの4フェーズ実行計画を管理するAPIです。OKR追跡、フェーズ進捗管理、週次レビュー支援機能を提供します。

## エンドポイント一覧

### 1. プロジェクト概要取得

```
GET /api/project/overview
```

**レスポンス例:**
```json
{
  "project": {
    "name": "BAYSGAiA現金残高最大化プロジェクト",
    "startDate": "2025-08-01",
    "endDate": "2025-12-31",
    "duration": "4ヶ月",
    "currentPhase": 2,
    "overallProgress": 0.35,
    "status": "on_track",
    "owner": "CEO 籾倉丸紀"
  },
  "objectives": {
    "mainObjective": "持続可能なキャッシュフロー最大化",
    "strategicPrinciples": [
      "外部コンサル不使用・自社AI活用",
      "公的資金最大活用",
      "段階的実装アプローチ",
      "CEO主導の迅速な意思決定",
      "リスクと機会の統合管理"
    ]
  }
}
```

### 2. OKR進捗取得

```
GET /api/project/okr
```

**レスポンス例:**
```json
{
  "okr": {
    "objective": "現金残高最大化による財務基盤強化",
    "period": "2025-08 to 2025-12",
    "keyResults": [
      {
        "id": "KR1",
        "title": "月末現金残高 +20%",
        "target": 0.20,
        "current": 0.052,
        "deadline": "2025-10-31",
        "status": "at_risk",
        "trend": "improving",
        "actions": ["緊急資金調達実行", "売掛金回収強化"]
      },
      {
        "id": "KR2",
        "title": "キャッシュ転換日数（CCC）-25%",
        "target": -0.25,
        "current": -0.18,
        "deadline": "2025-12-31",
        "status": "on_track",
        "trend": "stable"
      },
      {
        "id": "KR3",
        "title": "売上債権回収日数（DSO）-30%",
        "target": -0.30,
        "current": -0.22,
        "deadline": "2025-09-30",
        "status": "on_track",
        "trend": "improving"
      },
      {
        "id": "KR4",
        "title": "資金予測精度 ≧95%",
        "target": 0.95,
        "current": 0.925,
        "deadline": "2025-09-30",
        "status": "on_track",
        "trend": "stable"
      },
      {
        "id": "KR5",
        "title": "資金関連プロセス自動化 70%",
        "target": 0.70,
        "current": 0.35,
        "deadline": "2025-12-31",
        "status": "at_risk",
        "trend": "improving"
      }
    ],
    "overallScore": 0.65,
    "lastUpdated": "2025-08-08T09:00:00+09:00"
  }
}
```

### 3. フェーズ詳細取得

```
GET /api/project/phases/:phaseId
```

**レスポンス例:**
```json
{
  "phase": {
    "id": 2,
    "name": "Phase 2: システム導入",
    "period": "Week 4-7",
    "status": "in_progress",
    "progress": 0.45,
    "startDate": "2025-08-01",
    "endDate": "2025-08-28",
    "objectives": [
      "デジタルツール選定と導入",
      "IT導入補助金申請",
      "基本ダッシュボード構築",
      "売掛金管理パイロット実装"
    ],
    "deliverables": [
      {
        "id": "D2-1",
        "name": "財務ダッシュボードv1.0",
        "status": "completed",
        "completedDate": "2025-08-05"
      },
      {
        "id": "D2-2",
        "name": "GMOあおぞら銀行API接続",
        "status": "in_progress",
        "progress": 0.7,
        "deadline": "2025-08-15"
      },
      {
        "id": "D2-3",
        "name": "IT導入補助金申請書",
        "status": "pending",
        "deadline": "2025-09-22"
      }
    ],
    "risks": [
      {
        "risk": "API接続遅延",
        "probability": 0.3,
        "impact": "medium",
        "mitigation": "sunabar環境でのPoC先行実施"
      }
    ]
  }
}
```

### 4. タスク管理

```
GET /api/project/tasks
```

**クエリパラメータ:**
- `phase`: フェーズID
- `status`: 状態（todo, in_progress, completed, blocked）
- `priority`: 優先度（critical, high, medium, low）
- `assignee`: 担当者

**レスポンス例:**
```json
{
  "tasks": [
    {
      "id": "TASK001",
      "title": "GMOあおぞら銀行OAuth2.0実装",
      "phase": 2,
      "priority": "critical",
      "status": "in_progress",
      "assignee": "開発チーム",
      "progress": 0.7,
      "startDate": "2025-08-01",
      "dueDate": "2025-08-15",
      "dependencies": [],
      "blockers": [],
      "notes": "sunabar環境でのテスト完了"
    },
    {
      "id": "TASK002",
      "title": "SECURITY ACTION★★申請",
      "phase": 2,
      "priority": "high",
      "status": "todo",
      "assignee": "CEO",
      "dueDate": "2025-08-20",
      "dependencies": ["TASK001"],
      "requirement": "IT導入補助金申請要件"
    }
  ],
  "summary": {
    "total": 25,
    "completed": 10,
    "inProgress": 8,
    "todo": 6,
    "blocked": 1,
    "completionRate": 0.40
  }
}
```

### 5. 週次レビュー作成

```
POST /api/project/weekly-review
```

**リクエストボディ:**
```json
{
  "weekEnding": "2025-08-10",
  "achievements": [
    "基本ダッシュボード構築完了",
    "売掛金回収プロセス設計完了",
    "DSO 5%改善達成"
  ],
  "issues": [
    {
      "issue": "現金残高改善ペース遅延",
      "impact": "KR1達成リスク",
      "proposedAction": "日本政策金融公庫融資の即時申請"
    }
  ],
  "nextWeekPriorities": [
    "GMOあおぞら銀行API本番接続準備",
    "IT導入補助金申請書作成",
    "売掛金管理パイロット開始"
  ],
  "decisionsRequired": [
    {
      "decision": "追加資金調達の実行判断",
      "deadline": "2025-08-12",
      "owner": "CEO"
    }
  ]
}
```

### 6. マイルストーン管理

```
GET /api/project/milestones
```

**レスポンス例:**
```json
{
  "milestones": [
    {
      "id": "M1",
      "name": "Phase 1完了",
      "date": "2025-07-31",
      "status": "completed",
      "achievements": [
        "現状分析完了",
        "KPIベースライン確定",
        "緊急資金調達計画策定"
      ]
    },
    {
      "id": "M2",
      "name": "基本システム稼働",
      "date": "2025-08-15",
      "status": "at_risk",
      "progress": 0.8,
      "blockers": ["API認証実装遅延"],
      "criticalPath": true
    },
    {
      "id": "M3",
      "name": "IT導入補助金申請",
      "date": "2025-09-22",
      "status": "planned",
      "dependencies": ["SECURITY ACTION取得", "事業計画書完成"]
    }
  ],
  "criticalPathAnalysis": {
    "onSchedule": false,
    "delay": 3,
    "impactedMilestones": ["M2", "M4"],
    "recoveryPlan": "並行作業による遅延吸収"
  }
}
```

### 7. リソース管理

```
GET /api/project/resources
```

**レスポンス例:**
```json
{
  "budget": {
    "total": 5000000,
    "allocated": 3500000,
    "spent": 1200000,
    "remaining": 3800000,
    "burnRate": 300000,
    "projectedOverrun": 0
  },
  "team": {
    "members": [
      {
        "name": "CEO",
        "role": "プロジェクトオーナー",
        "allocation": 0.5,
        "currentTasks": 3
      },
      {
        "name": "開発チーム",
        "role": "システム実装",
        "allocation": 1.0,
        "currentTasks": 8
      }
    ],
    "totalCapacity": 3.5,
    "utilization": 0.85
  },
  "externalResources": [
    {
      "resource": "GMOあおぞら銀行API",
      "status": "testing",
      "availability": "24/7",
      "cost": 0
    }
  ]
}
```

### 8. Quick Win追跡

```
GET /api/project/quick-wins
```

**レスポンス例:**
```json
{
  "quickWins": [
    {
      "id": "QW001",
      "title": "小規模事業者持続化補助金申請",
      "impact": 500000,
      "effort": "low",
      "timeline": "2週間",
      "status": "completed",
      "actualImpact": 500000,
      "roi": 10.0
    },
    {
      "id": "QW002",
      "title": "支払サイト最適化",
      "impact": 1000000,
      "effort": "medium",
      "timeline": "1ヶ月",
      "status": "in_progress",
      "progress": 0.6,
      "expectedCompletion": "2025-08-20"
    }
  ],
  "summary": {
    "totalIdentified": 8,
    "completed": 3,
    "totalImpact": 2500000,
    "averageROI": 8.5
  }
}
```

### 9. 報告書生成

```
POST /api/project/reports/generate
```

**リクエストボディ:**
```json
{
  "reportType": "executive_summary",
  "period": "2025-08",
  "recipients": ["CEO", "相談役"],
  "sections": [
    "okr_progress",
    "phase_status",
    "risk_assessment",
    "financial_impact",
    "next_steps"
  ]
}
```

**レスポンス例:**
```json
{
  "reportId": "RPT20250808001",
  "generatedAt": "2025-08-08T15:00:00+09:00",
  "format": "pdf",
  "downloadUrl": "/api/project/reports/RPT20250808001/download",
  "summary": {
    "overallStatus": "amber",
    "keyHighlights": [
      "Phase 2進捗45%",
      "KR1, KR5要改善",
      "資金調達準備完了"
    ],
    "executiveActions": [
      "日本政策金融公庫融資承認",
      "追加リソース配分検討"
    ]
  }
}
```

## 通知・アラート

### 10. プロジェクトアラート設定

```
POST /api/project/alerts/configure
```

**リクエストボディ:**
```json
{
  "alerts": [
    {
      "type": "milestone_delay",
      "threshold": 3,
      "recipients": ["CEO", "PM"],
      "frequency": "daily"
    },
    {
      "type": "okr_deviation",
      "threshold": 0.1,
      "recipients": ["CEO"],
      "frequency": "weekly"
    }
  ]
}
```

## エラーコード

| コード | 説明 | 対処法 |
|--------|------|--------|
| PRJ_001 | フェーズが見つかりません | フェーズIDを確認 |
| PRJ_002 | タスク依存関係エラー | 依存タスクの完了を確認 |
| PRJ_003 | リソース不足 | リソース再配分を検討 |

## セキュリティ

- JWT認証必須
- ロールベースアクセス制御
- 監査ログ完全記録
- データ暗号化

## 実装ロードマップ

| 機能 | Phase 2 | Phase 3 | Phase 4 |
|------|---------|---------|---------|
| 基本プロジェクト管理 | ✅ | - | - |
| OKR追跡 | ✅ | - | - |
| 週次レビュー支援 | 🚧 | ✅ | - |
| 自動レポート生成 | 🔄 | ✅ | - |
| 予測分析 | - | 🔄 | ✅ |
| 外部ツール連携 | - | 🚧 | ✅ |