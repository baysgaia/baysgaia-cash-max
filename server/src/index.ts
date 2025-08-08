import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import config from './config';
import { logger } from './utils/logger';
import apiRoutes from './routes/api';
import { errorHandler } from './middleware/errorHandler';
import { startScheduledJobs } from './services/scheduler';
import { healthCheck } from './routes/health';

dotenv.config();

const app = express();
const PORT = config.api.port;

// セキュリティヘッダー
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS設定
app.use(cors({
  origin: config.security.corsOrigin,
  credentials: true
}));

// レート制限
const limiter = rateLimit({
  windowMs: config.app.rateLimitWindowMs,
  max: config.app.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ボディパーサー
app.use(express.json({ limit: config.app.maxRequestSize }));
app.use(express.urlencoded({ extended: true, limit: config.app.maxRequestSize }));

// ヘルスチェック
app.use('/health', healthCheck);

// APIルート
app.use('/api', apiRoutes);

// 404ハンドラー
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

// グレースフルシャットダウン
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  logger.info(`BAYSGAiA財務改革システム - Server running on port ${PORT}`);
  logger.info(`Environment: ${config.env}`);
  logger.info(`Database: ${config.database.url.split('@')[1]}`); // パスワードを除外してログ
  logger.info(`GMO Aozora API: ${config.gmoAozora.environment} mode`);
  
  // スケジューラー起動
  startScheduledJobs();
});