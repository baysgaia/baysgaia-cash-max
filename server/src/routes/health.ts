import { Router } from 'express';
import { logger } from '../utils/logger';

const router = Router();

interface HealthCheck {
  status: 'ok' | 'error';
  message?: string;
  latency?: number;
}

interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: HealthCheck;
    redis: HealthCheck;
    gmoApi: HealthCheck;
  };
  version: string;
}

// データベース接続チェック
async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // TODO: 実際のデータベース接続チェックを実装
    // await db.query('SELECT 1');
    return { status: 'ok', latency: Date.now() - start };
  } catch (error: any) {
    logger.error('Database health check failed:', error);
    return { status: 'error', message: error.message };
  }
}

// Redis接続チェック
async function checkRedis(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // TODO: 実際のRedis接続チェックを実装
    // await redis.ping();
    return { status: 'ok', latency: Date.now() - start };
  } catch (error: any) {
    logger.error('Redis health check failed:', error);
    return { status: 'error', message: error.message };
  }
}

// GMOあおぞらネット銀行API接続チェック
async function checkGMOAPI(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // TODO: 実際のAPI接続チェックを実装（ヘルスエンドポイントがある場合）
    // 現在はモックデータのため常にOK
    return { status: 'ok', latency: Date.now() - start };
  } catch (error: any) {
    logger.error('GMO API health check failed:', error);
    return { status: 'error', message: error.message };
  }
}

// ヘルスチェックエンドポイント
router.get('/', async (_req, res) => {
  try {
    const health: HealthResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: await checkDatabase(),
        redis: await checkRedis(),
        gmoApi: await checkGMOAPI(),
      },
      version: process.env.npm_package_version || '1.0.0',
    };

    // すべてのチェックがOKか確認
    const isHealthy = Object.values(health.checks).every(
      check => check.status === 'ok'
    );

    if (!isHealthy) {
      health.status = 'unhealthy';
    }

    res.status(isHealthy ? 200 : 503).json(health);
  } catch (error: any) {
    logger.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// 簡易ヘルスチェック（ロードバランサー用）
router.get('/live', (_req, res) => {
  res.status(200).send('OK');
});

// 準備状態チェック（Kubernetes用）
router.get('/ready', async (_req, res) => {
  try {
    const dbCheck = await checkDatabase();
    if (dbCheck.status === 'ok') {
      res.status(200).send('Ready');
    } else {
      res.status(503).send('Not Ready');
    }
  } catch (error) {
    res.status(503).send('Not Ready');
  }
});

export { router as healthCheck };