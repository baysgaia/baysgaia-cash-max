/**
 * BAYSGAiA財務改革システム - 設定管理
 */

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
  redis: {
    url: string;
  };
  gmoAozora: {
    clientId: string;
    clientSecret: string;
    apiUrl: string;
    redirectUri: string;
    environment: 'sunabar' | 'production';
  };
  security: {
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;
    bcryptRounds: number;
    sessionSecret: string;
    corsOrigin: string;
  };
  mail: {
    host: string;
    port: number;
    user: string;
    pass: string;
    alertRecipients: string[];
  };
  logging: {
    level: string;
    filePath: string;
    maxSize: string;
    maxFiles: number;
  };
  monitoring: {
    sentryDsn?: string;
    enabled: boolean;
    healthCheckInterval: number;
  };
  backup: {
    s3Bucket: string;
    retentionDays: number;
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
    awsRegion: string;
  };
  compliance: {
    timestampAuthorityUrl: string;
    documentRetentionYears: number;
  };
  app: {
    timezone: string;
    maxRequestSize: string;
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
  };
}

const config: Config = {
  env: (process.env.NODE_ENV as any) || 'development',
  api: {
    port: parseInt(process.env.PORT || '5000', 10),
    baseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/baysgaia_cashmax',
    ssl: process.env.NODE_ENV === 'production',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  gmoAozora: {
    clientId: process.env.GMO_AOZORA_CLIENT_ID || '',
    clientSecret: process.env.GMO_AOZORA_CLIENT_SECRET || '',
    apiUrl: process.env.GMO_AOZORA_API_URL || 'https://api.gmo-aozora.com/ganb/api/personal/v1',
    redirectUri: process.env.GMO_AOZORA_REDIRECT_URI || 'http://localhost:5000/api/bank/callback',
    environment: (process.env.GMO_AOZORA_ENV as any) || 'sunabar',
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || 'development_secret_please_change',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    sessionSecret: process.env.SESSION_SECRET || 'session_secret_please_change',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  mail: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    alertRecipients: process.env.ALERT_RECIPIENTS?.split(',') || ['ceo@baysgaia.com'],
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs',
    maxSize: process.env.LOG_MAX_SIZE || '100M',
    maxFiles: parseInt(process.env.LOG_MAX_FILES || '7', 10),
  },
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    enabled: process.env.MONITORING_ENABLED === 'true',
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '60000', 10),
  },
  backup: {
    s3Bucket: process.env.BACKUP_S3_BUCKET || 'baysgaia-backups',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '90', 10),
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    awsRegion: process.env.AWS_REGION || 'ap-northeast-1',
  },
  compliance: {
    timestampAuthorityUrl: process.env.TIMESTAMP_AUTHORITY_URL || '',
    documentRetentionYears: parseInt(process.env.DOCUMENT_RETENTION_YEARS || '7', 10),
  },
  app: {
    timezone: process.env.TZ || 'Asia/Tokyo',
    maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
};

// 必須環境変数のチェック
const validateConfig = () => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SESSION_SECRET',
  ];

  if (config.env === 'production') {
    requiredEnvVars.push(
      'GMO_AOZORA_CLIENT_ID',
      'GMO_AOZORA_CLIENT_SECRET',
      'SENTRY_DSN',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY'
    );
  }

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    if (config.env === 'production') {
      process.exit(1);
    }
  }
};

validateConfig();

export default config;