# デプロイメントガイド

## 概要

本ドキュメントでは、BAYSGAiA現金残高最大化システムのデプロイメント手順を説明します。

## 前提条件

- Node.js 18以上がインストールされていること
- npmまたはyarnが利用可能であること
- Gitがインストールされていること
- 本番環境へのアクセス権限があること

## ローカル開発環境

### セットアップ

```bash
# リポジトリのクローン
git clone https://github.com/baysgaia/baysgaia-cash-max.git
cd baysgaia-cash-max

# 依存関係のインストール
npm run install:all

# 環境変数の設定
cp server/.env.example server/.env
# .envファイルを編集して必要な値を設定
```

### 環境変数

#### サーバー側 (.env)

```env
# アプリケーション設定
NODE_ENV=development
PORT=5000

# データベース設定
DATABASE_URL=postgresql://user:password@localhost:5432/cashmax

# 銀行API設定
GMO_AOZORA_API_URL=https://api.gmo-aozora.com/v1
GMO_AOZORA_CLIENT_ID=your_client_id
GMO_AOZORA_CLIENT_SECRET=your_client_secret

# JWT設定
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# その他のAPI
OPENAI_API_KEY=your_openai_api_key
```

### 開発サーバーの起動

```bash
# 開発サーバー起動（フロントエンド + バックエンド）
npm run dev

# 個別起動
npm run server:dev  # バックエンドのみ
npm run client:dev  # フロントエンドのみ
```

## ビルド

### プロダクションビルド

```bash
# 全体ビルド
npm run build

# 個別ビルド
npm run server:build
npm run client:build
```

### ビルド成果物

- サーバー: `server/dist/`
- クライアント: `client/dist/`

## デプロイメント

### 手動デプロイ

```bash
# 1. コードの最新化
git pull origin main

# 2. 依存関係の更新
npm run install:all

# 3. ビルド
npm run build

# 4. サーバー起動
npm run start
```

### Docker デプロイ

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 依存関係のコピーとインストール
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
RUN npm run install:all

# ソースコードのコピー
COPY . .

# ビルド
RUN npm run build

# ポート公開
EXPOSE 5000

# アプリケーション起動
CMD ["npm", "run", "start"]
```

```bash
# Dockerイメージのビルド
docker build -t baysgaia-cash-max .

# コンテナの起動
docker run -p 5000:5000 --env-file .env baysgaia-cash-max
```

### CI/CDパイプライン (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm run install:all
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      
    - name: Deploy to production
      env:
        DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
      run: |
        # デプロイスクリプト実行
        ./scripts/deploy.sh
```

## 本番環境設定

### Nginx設定例

```nginx
server {
    listen 80;
    server_name cash-max.baysgaia.com;
    
    # HTTPSへリダイレクト
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cash-max.baysgaia.com;
    
    # SSL証明書
    ssl_certificate /etc/letsencrypt/live/cash-max.baysgaia.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cash-max.baysgaia.com/privkey.pem;
    
    # 静的ファイル
    location / {
        root /var/www/cash-max/client/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API プロキシ
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### PM2設定

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'baysgaia-cash-max',
    script: 'server/dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

```bash
# PM2でアプリケーション起動
pm2 start ecosystem.config.js

# 自動起動設定
pm2 startup
pm2 save
```

## 監視とログ

### ヘルスチェック

```bash
# APIヘルスチェック
curl https://cash-max.baysgaia.com/api/health
```

### ログ管理

```bash
# PM2ログ確認
pm2 logs baysgaia-cash-max

# ログローテーション設定
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7
```

## トラブルシューティング

### よくある問題

1. **ポート競合**
   ```bash
   # 使用中のポート確認
   lsof -i :5000
   # プロセスの停止
   kill -9 <PID>
   ```

2. **メモリ不足**
   ```bash
   # Node.jsメモリ上限の設定
   NODE_OPTIONS="--max-old-space-size=4096" npm run start
   ```

3. **SSL証明書エラー**
   ```bash
   # Let's Encrypt証明書の更新
   certbot renew
   ```

## バックアップとリストア

### データベースバックアップ

```bash
# バックアップスクリプト
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql

# S3へアップロード
aws s3 cp backup_$DATE.sql s3://baysgaia-backups/cash-max/
```

### リストア手順

```bash
# 最新バックアップのダウンロード
aws s3 cp s3://baysgaia-backups/cash-max/backup_latest.sql .

# データベースリストア
psql $DATABASE_URL < backup_latest.sql
```

## セキュリティチェックリスト

- [ ] 環境変数が適切に設定されている
- [ ] HTTPS が有効になっている
- [ ] ファイアウォールが適切に設定されている
- [ ] 不要なポートが閉じられている
- [ ] 定期的なセキュリティアップデートが設定されている
- [ ] バックアップが定期的に実行されている
- [ ] 監視アラートが設定されている