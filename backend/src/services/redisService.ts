import { createClient } from 'redis';
import logger from '../utils/logger';

class RedisService {
  private client: any;
  private connected: boolean = false;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    this.client.on('error', (err: any) => logger.error(`Redis error: ${err}`));
    this.client.on('connect', () => {
      this.connected = true;
      logger.info('Redis connected');
    });
  }

  async connect() {
    if (!this.connected) {
      await this.client.connect();
    }
  }

  async set(key: string, value: string, ttl?: number) {
    if (!this.connected) await this.connect();
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.connected) await this.connect();
    return await this.client.get(key);
  }

  async del(key: string) {
    if (!this.connected) await this.connect();
    return await this.client.del(key);
  }

  async flushAll() {
    if (!this.connected) await this.connect();
    return await this.client.flushAll();
  }
}

export default RedisService;
