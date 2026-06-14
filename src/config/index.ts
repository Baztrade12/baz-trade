import dotenv from 'dotenv';

dotenv.config();

export const config = {
  binance: {
    apiKey: process.env.BINANCE_API_KEY || '',
    apiSecret: process.env.BINANCE_API_SECRET || '',
  },
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/baz_crypto_tech',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  bot: {
    port: parseInt(process.env.BOT_PORT || '3001'),
    logLevel: process.env.BOT_LOG_LEVEL || 'info',
    minFundingRate: parseFloat(process.env.BOT_MIN_FUNDING_RATE || '0.02'),
    maxPositionSize: parseFloat(process.env.BOT_MAX_POSITION_SIZE || '10000'),
    leverage: parseInt(process.env.BOT_LEVERAGE || '1'),
  },
  trading: {
    minProfitPercent: parseFloat(process.env.TRADING_MIN_PROFIT_PERCENT || '0.5'),
    executionTimeoutMs: parseInt(process.env.TRADING_EXECUTION_TIMEOUT_MS || '1000'),
    rebalanceIntervalMs: parseInt(process.env.TRADING_REBALANCE_INTERVAL_MS || '60000'),
  },
  dashboard: {
    apiPort: parseInt(process.env.DASHBOARD_API_PORT || '3002'),
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  },
  env: process.env.NODE_ENV || 'development',
};
