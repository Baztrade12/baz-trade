import logger from '../logger';
import { BinanceClient } from './binance.client';
import { TradingEngine } from './trading.engine';
import { PortfolioManager } from './portfolio.manager';
import { config } from '../config';

class BAZCryptoTechBot {
  private binanceClient: BinanceClient;
  private tradingEngine: TradingEngine;
  private portfolioManager: PortfolioManager;
  private isRunning: boolean = false;

  constructor() {
    this.binanceClient = new BinanceClient(config.binance.apiKey, config.binance.apiSecret);
    this.portfolioManager = new PortfolioManager(this.binanceClient);
    this.tradingEngine = new TradingEngine(this.binanceClient, this.portfolioManager);
  }

  async start(): Promise<void> {
    try {
      logger.info('Starting BAZ Crypto Tech Bot...');
      this.isRunning = true;

      // Initialize portfolio
      await this.portfolioManager.initialize();
      logger.info('Portfolio initialized');

      // Start trading engine
      await this.tradingEngine.start();
      logger.info('Trading engine started');

      logger.info('BAZ Crypto Tech Bot is running');
    } catch (error) {
      logger.error('Failed to start bot:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      logger.info('Stopping BAZ Crypto Tech Bot...');
      this.isRunning = false;
      await this.tradingEngine.stop();
      logger.info('Bot stopped successfully');
    } catch (error) {
      logger.error('Error stopping bot:', error);
      throw error;
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      portfolio: this.portfolioManager.getMetrics(),
      activePositions: this.tradingEngine.getActivePositions(),
    };
  }
}

// Main execution
if (require.main === module) {
  const bot = new BAZCryptoTechBot();

  process.on('SIGINT', async () => {
    logger.info('Received SIGINT, shutting down...');
    await bot.stop();
    process.exit(0);
  });

  bot.start().catch((error) => {
    logger.error('Fatal error:', error);
    process.exit(1);
  });
}

export { BAZCryptoTechBot };
