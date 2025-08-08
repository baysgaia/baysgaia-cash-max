# デプロイメント仕様書

## 概要

BAYSGAiA財務改革システムのデプロイメント手順と環境構成を定義します。開発環境から本番環境まで、安全で効率的なデプロイプロセスを確立します。

## 環境構成

### 環境一覧

| 環境 | 用途 | URL | 特徴 |
|------|------|-----|------|
| 開発（dev） | 開発・テスト | http://localhost:3000 | モックデータ使用 |
| ステージング（stg） | 受入テスト | https://stg.cashflow.baysgaia.com | 本番同等構成 |
| 本番（prod） | 本番運用 | https://cashflow.baysgaia.com | 高可用性構成 |

### インフラ構成

```yaml
# docker-compose.yml (開発環境)
version: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/baysgaia
    depends_on:
      - db
      - redis
    volumes:
      - ./server:/app
      - /app/node_modules

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    volumes:
      - ./client:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=baysgaia
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## ビルドプロセス

### 自動ビルドパイプライン

```yaml
# .github/workflows/build.yml
name: Build and Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm run install:all
        
      - name: Run linter
        run: npm run lint
        
      - name: Run type check
        run: npm run typecheck
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run security audit
        run: npm audit --production
        
      - name: Run vulnerability scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
```

### ビルド手順

```bash
# 1. 依存関係のインストール
npm run install:all

# 2. 環境変数の設定
cp .env.example .env.production
# 本番用の値を設定

# 3. ビルド実行
npm run build

# 4. ビルド成果物の確認
ls -la server/dist/
ls -la client/dist/
```

## 環境設定

### 環境変数管理

```typescript
// config/index.ts
interface Config {
  env: 'development' | 'staging' | 'production';
  api: {
    port: number;
    baseUrl: string;
  };
  database: {
    url: string;
    ssl: boolean;
  };
  gmoAozora: {
    clientId: string;
    clientSecret: string;
    apiUrl: string;
  };
  security: {
    jwtSecret: string;
    bcryptRounds: number;
  };
  monitoring: {
    sentryDsn?: string;
    logLevel: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV as any || 'development',
  api: {
    port: parseInt(process.env.PORT || '5000'),
    baseUrl: process.env.API_BASE_URL || 'http://localhost:5000'
  },
  database: {
    url: process.env.DATABASE_URL || '',
    ssl: process.env.NODE_ENV === 'production'
  },
  gmoAozora: {
    clientId: process.env.GMO_AOZORA_CLIENT_ID || '',
    clientSecret: process.env.GMO_AOZORA_CLIENT_SECRET || '',
    apiUrl: process.env.GMO_AOZORA_API_URL || ''
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || '',
    bcryptRounds: 10
  },
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    logLevel: process.env.LOG_LEVEL || 'info'
  }
};

export default config;
```

### シークレット管理

```bash
# AWS Secrets Manager (本番環境)
aws secretsmanager create-secret \
  --name baysgaia/production/api \
  --secret-string '{
    "GMO_AOZORA_CLIENT_SECRET": "xxx",
    "DATABASE_PASSWORD": "xxx",
    "JWT_SECRET": "xxx"
  }'

# Kubernetes Secrets
kubectl create secret generic baysgaia-secrets \
  --from-literal=gmo-aozora-secret=$GMO_AOZORA_CLIENT_SECRET \
  --from-literal=db-password=$DATABASE_PASSWORD \
  --from-literal=jwt-secret=$JWT_SECRET
```

## デプロイメント手順

### Phase 2: 基本デプロイ（現在）

```bash
#!/bin/bash
# deploy.sh

# 1. ビルド
echo "Building application..."
npm run build

# 2. テスト実行
echo "Running tests..."
npm test

# 3. サーバーへの転送
echo "Deploying to server..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.env' \
  ./server/dist/ user@server:/var/www/baysgaia-api/

rsync -avz --delete \
  ./client/dist/ user@server:/var/www/baysgaia-frontend/

# 4. サービス再起動
ssh user@server "sudo systemctl restart baysgaia-api"
ssh user@server "sudo nginx -s reload"

echo "Deployment completed!"
```

### Phase 3: CI/CDパイプライン（計画中）

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker images
        run: |
          docker build -t baysgaia/backend:${{ github.sha }} ./server
          docker build -t baysgaia/frontend:${{ github.sha }} ./client
          
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push baysgaia/backend:${{ github.sha }}
          docker push baysgaia/frontend:${{ github.sha }}
          
      - name: Deploy to Kubernetes
        env:
          KUBE_CONFIG: ${{ secrets.KUBE_CONFIG }}
        run: |
          echo "$KUBE_CONFIG" | base64 -d > kubeconfig
          export KUBECONFIG=kubeconfig
          kubectl set image deployment/backend backend=baysgaia/backend:${{ github.sha }}
          kubectl set image deployment/frontend frontend=baysgaia/frontend:${{ github.sha }}
          kubectl rollout status deployment/backend
          kubectl rollout status deployment/frontend
```

## モニタリング

### ヘルスチェック

```typescript
// server/src/routes/health.ts
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      gmoApi: await checkGMOAPI()
    }
  };
  
  const isHealthy = Object.values(health.checks).every(check => check.status === 'ok');
  res.status(isHealthy ? 200 : 503).json(health);
});

async function checkDatabase(): Promise<HealthCheck> {
  try {
    await db.query('SELECT 1');
    return { status: 'ok', latency: 5 };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
```

### ログ設定

```typescript
// server/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

## バックアップとリストア

### 自動バックアップ

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# データベースバックアップ
pg_dump $DATABASE_URL | gzip > $BACKUP_DIR/database.sql.gz

# アプリケーションファイル
tar -czf $BACKUP_DIR/application.tar.gz /var/www/baysgaia-*

# S3へアップロード
aws s3 sync $BACKUP_DIR s3://baysgaia-backups/$(date +%Y%m%d)/

# 古いバックアップの削除（90日以上）
find /backups -type d -mtime +90 -exec rm -rf {} \;
```

### リストア手順

```bash
#!/bin/bash
# restore.sh

RESTORE_DATE=$1
BACKUP_DIR="/backups/$RESTORE_DATE"

# S3からダウンロード
aws s3 sync s3://baysgaia-backups/$RESTORE_DATE/ $BACKUP_DIR/

# データベースリストア
gunzip < $BACKUP_DIR/database.sql.gz | psql $DATABASE_URL

# アプリケーションリストア
tar -xzf $BACKUP_DIR/application.tar.gz -C /

# サービス再起動
systemctl restart baysgaia-api
nginx -s reload
```

## ロールバック手順

### Blue-Greenデプロイメント

```nginx
# nginx.conf
upstream backend {
    server blue.api.baysgaia.com weight=100;
    server green.api.baysgaia.com weight=0;
}

# ロールバック時は weight を入れ替え
```

### Kubernetesロールバック

```bash
# 直前のバージョンにロールバック
kubectl rollout undo deployment/backend
kubectl rollout undo deployment/frontend

# 特定のバージョンにロールバック
kubectl rollout undo deployment/backend --to-revision=3
```

## パフォーマンスチューニング

### Node.js設定

```javascript
// pm2.config.js
module.exports = {
  apps: [{
    name: 'baysgaia-api',
    script: './dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### Nginx設定

```nginx
# /etc/nginx/sites-available/baysgaia
server {
    listen 80;
    server_name cashflow.baysgaia.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cashflow.baysgaia.com;
    
    ssl_certificate /etc/ssl/certs/baysgaia.crt;
    ssl_certificate_key /etc/ssl/private/baysgaia.key;
    
    # セキュリティヘッダー
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # 静的ファイル
    location / {
        root /var/www/baysgaia-frontend;
        try_files $uri $uri/ /index.html;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
    
    # API プロキシ
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 災害復旧計画

### RPO/RTO目標

- **RPO（復旧時点目標）**: 1時間
- **RTO（復旧時間目標）**: 4時間

### 復旧手順

1. **障害検知** (15分以内)
   - 自動監視アラート
   - CEO/CFO通知

2. **初期対応** (30分以内)
   - 障害範囲特定
   - 緊急対策チーム招集

3. **復旧作業** (3時間以内)
   - バックアップからのリストア
   - サービス再開

4. **事後対応** (24時間以内)
   - 原因分析
   - 再発防止策策定

## チェックリスト

### デプロイ前チェック
- [ ] 全テスト合格
- [ ] セキュリティスキャン完了
- [ ] 環境変数設定確認
- [ ] バックアップ実行
- [ ] ロールバック手順確認

### デプロイ後チェック
- [ ] ヘルスチェック正常
- [ ] 主要機能動作確認
- [ ] パフォーマンス確認
- [ ] ログ出力確認
- [ ] アラート設定確認

## 実装状況

### Phase 2（現在）
- ✅ 基本的なデプロイプロセス
- ✅ 手動デプロイスクリプト
- 🚀 Dockerコンテナ化
- 🔄 基本的な監視

### Phase 3（計画中）
- ⏳ CI/CDパイプライン
- ⏳ Kubernetesデプロイ
- ⏳ 自動スケーリング
- ⏳ Blue-Greenデプロイ

### Phase 4（将来拡張）
- ⏳ マルチリージョン対応
- ⏳ グローバルCDN
- ⏳ エッジコンピューティング

## サポート情報

### ドキュメント
- デプロイメントガイド: `/docs/technical/deployment.md`
- セキュリティ仕様: `/docs/technical/security.md`
- API仕様: `/docs/api/`

### 連絡先
- **技術サポート**: support@baysgaia.com
- **緊急時**: CEO直通（Critical Alert発生時）
- **プロジェクトオーナー**: CEO 籾倉丸紀