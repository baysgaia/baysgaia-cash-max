# GMOあおぞらネット銀行API仕様書

## 概要

BAYSGAiA財務改革システムにおけるGMOあおぞらネット銀行API連携の仕様書です。

## API認証

### OAuth2.0認証フロー

1. **認証URL生成**
   ```
   GET /api/bank/auth
   ```
   
2. **アクセストークン取得**
   ```
   POST /api/bank/token
   ```

### 必要な環境変数

```env
# GMOあおぞらネット銀行API設定
GMO_AOZORA_CLIENT_ID=your_client_id
GMO_AOZORA_CLIENT_SECRET=your_client_secret
GMO_AOZORA_REDIRECT_URI=http://localhost:5000/api/bank/callback
GMO_AOZORA_API_BASE_URL=https://api.gmo-aozora.com/ganb/api/personal/v1
```

## APIエンドポイント

### 1. 残高照会

```
GET /api/bank/balance
```

**レスポンス例:**
```json
{
  "accountId": "101010123456789",
  "accountName": "BAYSGAiA 決済口座",
  "balance": 5234567,
  "availableBalance": 5234567,
  "currency": "JPY",
  "lastUpdated": "2025-08-08T10:30:00+09:00"
}
```

### 2. 入出金明細照会

```
GET /api/bank/transactions
```

**クエリパラメータ:**
- `dateFrom`: 照会開始日（YYYY-MM-DD）
- `dateTo`: 照会終了日（YYYY-MM-DD）
- `limit`: 取得件数（デフォルト: 100）

**レスポンス例:**
```json
{
  "transactions": [
    {
      "transactionId": "20250808001",
      "transactionDate": "2025-08-08",
      "valueDate": "2025-08-08",
      "transactionType": "入金",
      "amount": 1000000,
      "balance": 5234567,
      "remarks": "売掛金回収 A社",
      "payerName": "株式会社A",
      "payeeName": "BAYSGAiA"
    }
  ],
  "totalCount": 150,
  "hasMore": true
}
```

### 3. 振込状況照会

```
GET /api/bank/transfers/:transferId
```

**レスポンス例:**
```json
{
  "transferId": "TRF20250808001",
  "status": "completed",
  "transferDate": "2025-08-08",
  "amount": 500000,
  "payeeName": "株式会社B",
  "payeeAccount": "普通 1234567",
  "payeeBankName": "みずほ銀行",
  "remarks": "仕入代金支払い"
}
```

### 4. 振込実行

```
POST /api/bank/transfers
```

**リクエストボディ:**
```json
{
  "transferDate": "2025-08-08",
  "transfers": [
    {
      "amount": 500000,
      "payeeName": "株式会社B",
      "payeeAccount": "1234567",
      "payeeBankCode": "0001",
      "payeeBranchCode": "001",
      "accountType": "普通",
      "remarks": "仕入代金支払い"
    }
  ]
}
```

## エラーレスポンス

### エラーコード一覧

| コード | 説明 | 対処法 |
|--------|------|--------|
| 401 | 認証エラー | アクセストークンを再取得 |
| 403 | 権限不足 | API権限設定を確認 |
| 429 | レート制限 | 時間をおいてリトライ |
| 500 | サーバーエラー | サポートに連絡 |

### エラーレスポンス例

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "アクセストークンが無効です",
    "timestamp": "2025-08-08T10:30:00+09:00"
  }
}
```

## セキュリティ要件

1. **通信要件**
   - HTTPS通信必須（TLS1.2以上）
   - IPアドレス制限（本番環境）

2. **認証要件**
   - OAuth2.0による認証
   - アクセストークンの有効期限: 3600秒
   - リフレッシュトークンによる自動更新

3. **データ保護**
   - 機密情報のマスキング
   - 監査ログの記録
   - アクセス権限の最小化

## レート制限

- 1分あたり60リクエスト
- 1日あたり10,000リクエスト
- バースト制限: 10リクエスト/秒

## 開発環境と本番環境

### 開発環境（sunabar）
- モックデータによる動作確認
- 制限なしのテスト実行
- エラーシミュレーション機能

### 本番環境
- 実際の口座データへのアクセス
- 厳格なセキュリティ制御
- 24時間365日監視体制

## 実装ステータス

| 機能 | 開発環境 | 本番環境 |
|------|----------|----------|
| 残高照会 | ✅ 実装済 | 🔄 準備中 |
| 入出金明細 | ✅ 実装済 | 🔄 準備中 |
| 振込状況照会 | ✅ 実装済 | 🔄 準備中 |
| 振込実行 | 🚧 開発中 | ❌ 未実装 |

## サポート情報

- **技術サポート**: support@baysgaia.com
- **API仕様書**: [GMOあおぞらネット銀行開発者ポータル](https://api.gmo-aozora.com)
- **緊急連絡先**: CEO直通（Critical Alert発生時）