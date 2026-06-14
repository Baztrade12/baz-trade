import BinanceService from './binanceService';
import RedisService from './redisService';
import { prisma } from '../db/database';
import logger from '../utils/logger';
import { Server } from 'socket.io';
import Decimal from 'decimal.js';

interface BotConfig {
  enabled: boolean;
  leverage: number;
  minFundingRate: number;
  maxPositionSize: number;
  profitTarget: number;
  maxHeat: number;
}

class BotService {
  private binanceService: BinanceService;
  private redisService: RedisService;
  private io: Server | null = null;
  private config: BotConfig;
  private isRunning: boolean = false;
  private scanInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.binanceService = new BinanceService();
    this.redisService = new RedisService();
    this.config = {
      enabled: true,
      leverage: parseInt(process.env.BOT_LEVERAGE || '2'),
      minFundingRate: parseFloat(process.env.FUNDING_RATE_MIN_THRESHOLD || '0.05'),
      maxPositionSize: parseInt(process.env.BOT_MAX_POSITION_SIZE || '100'),
      profitTarget: parseFloat(process.env.BOT_MIN_PROFIT_PERCENTAGE || '0.1'),
      maxHeat: parseInt(process.env.BOT_MAX_PORTFOLIO_HEAT || '5000')
    };
  }

  setIO(io: Server) {
    this.io = io;
  }

  /**
   * Start the bot
   */
  async start() {
    if (this.isRunning) {
      logger.warn('Bot is already running');
      return false;
    }

    try {
      this.isRunning = true;
      await this.redisService.set('bot:status', 'running');
      
      logger.info('🤖 BAZ Trading Bot started');
      this.broadcastBotStatus('running');
      
      this.startScanLoop();
      return true;
    } catch (error) {
      logger.error(`Failed to start bot: ${error}`);
      this.isRunning = false;
      return false;
    }
  }

  /**
   * Stop the bot
   */
  async stop() {
    if (!this.isRunning) {
      logger.warn('Bot is not running');
      return false;
    }

    try {
      this.isRunning = false;
      if (this.scanInterval) {
        clearInterval(this.scanInterval);
      }
      
      await this.redisService.set('bot:status', 'stopped');
      logger.info('⏹️ BAZ Trading Bot stopped');
      this.broadcastBotStatus('stopped');
      return true;
    } catch (error) {
      logger.error(`Failed to stop bot: ${error}`);
      return false;
    }
  }

  /**
   * Get bot status
   */
  async getStatus() {
    const status = await this.redisService.get('bot:status');
    return {
      running: this.isRunning,
      status: status || 'unknown',
      config: this.config
    };
  }

  /**
   * Main scanning loop
   */
  private startScanLoop() {
    const interval = parseInt(process.env.FUNDING_RATE_CHECK_INTERVAL || '60000');
    
    this.scanInterval = setInterval(async () => {
      try {
        await this.scanFundingRates();
      } catch (error) {
        logger.error(`Scan loop error: ${error}`);
      }
    }, interval);
  }

  /**
   * Scan for funding rate opportunities
   */
  private async scanFundingRates() {
    try {
      const balance = await this.binanceService.getBalance();
      const totalBalance = balance.total?.USDT || 0;

      // Get current portfolio heat
      const heat = await this.calculatePortfolioHeat();
      
      if (heat >= this.config.maxHeat) {
        logger.warn(`Portfolio heat (${heat}) exceeded max heat (${this.config.maxHeat})`);
        return;
      }

      // Scan top trading pairs
      const symbols = await this.getTopTradingSymbols();
      const opportunities: any[] = [];

      for (const symbol of symbols) {
        const fundingData = await this.binanceService.getFundingRate(symbol);
        if (!fundingData) continue;

        // Check for LONG opportunities (negative funding rate)
        if (fundingData.fundingRate < -this.config.minFundingRate) {
          opportunities.push({
            symbol,
            type: 'long',
            fundingRate: fundingData.fundingRate,
            nextFundingTime: fundingData.nextFundingTime
          });
        }

        // Check for SHORT opportunities (positive funding rate)
        if (fundingData.fundingRate > this.config.minFundingRate) {
          opportunities.push({
            symbol,
            type: 'short',
            fundingRate: fundingData.fundingRate,
            nextFundingTime: fundingData.nextFundingTime
          });
        }
      }

      // Sort by funding rate magnitude
      opportunities.sort((a, b) => Math.abs(b.fundingRate) - Math.abs(a.fundingRate));

      // Execute trades on best opportunities
      for (const opp of opportunities.slice(0, 5)) {
        await this.executeTrade(opp, totalBalance);
      }

      this.broadcastOpportunities(opportunities);
    } catch (error) {
      logger.error(`Error scanning funding rates: ${error}`);
    }
  }

  /**
   * Execute trade for opportunity
   */
  private async executeTrade(opportunity: any, accountBalance: number) {
    try {
      const markPrice = await this.binanceService.getMarkPrice(opportunity.symbol);
      const positionSize = this.binanceService.calculatePositionSize(
        accountBalance,
        this.config.leverage,
        2 // 2% risk per trade
      );

      if (positionSize > this.config.maxPositionSize) {
        logger.warn(`Position size ${positionSize} exceeds max ${this.config.maxPositionSize}`);
        return;
      }

      const side = opportunity.type === 'long' ? 'buy' : 'sell';
      const amount = new Decimal(positionSize).dividedBy(markPrice).toNumber();

      logger.info(`Executing ${opportunity.type} trade: ${opportunity.symbol} x${amount}`);

      const order = await this.binanceService.placeMarketOrder(
        opportunity.symbol,
        side,
        amount,
        this.config.leverage
      );

      // Save trade to database
      await prisma.trade.create({
        data: {
          symbol: opportunity.symbol,
          side,
          type: 'market',
          quantity: amount,
          entryPrice: markPrice,
          leverage: this.config.leverage,
          fundingRate: opportunity.fundingRate,
          status: 'open',
          orderId: order.id?.toString() || '',
          entryTime: new Date()
        }
      });

      this.broadcastTradeExecuted({
        symbol: opportunity.symbol,
        side,
        amount,
        price: markPrice,
        fundingRate: opportunity.fundingRate
      });
    } catch (error) {
      logger.error(`Failed to execute trade: ${error}`);
    }
  }

  /**
   * Get top trading symbols
   */
  private async getTopTradingSymbols(): Promise<string[]> {
    // Hardcoded top symbols for now
    return [
      'BTC/USDT',
      'ETH/USDT',
      'BNB/USDT',
      'SOL/USDT',
      'XRP/USDT',
      'ADA/USDT',
      'DOGE/USDT',
      'AVAX/USDT',
      'MATIC/USDT',
      'OP/USDT'
    ];
  }

  /**
   * Calculate current portfolio heat
   */
  private async calculatePortfolioHeat(): Promise<number> {
    try {
      const trades = await prisma.trade.findMany({
        where: { status: 'open' }
      });

      let totalHeat = 0;
      for (const trade of trades) {
        const markPrice = await this.binanceService.getMarkPrice(trade.symbol);
        const positionValue = new Decimal(trade.quantity).times(markPrice).toNumber();
        totalHeat += positionValue;
      }

      return totalHeat;
    } catch (error) {
      logger.error(`Failed to calculate portfolio heat: ${error}`);
      return 0;
    }
  }

  // Broadcasting methods
  private broadcastBotStatus(status: string) {
    if (this.io) {
      this.io.emit('bot:status', { status, timestamp: Date.now() });
    }
  }

  private broadcastOpportunities(opportunities: any[]) {
    if (this.io) {
      this.io.emit('opportunities', { opportunities, timestamp: Date.now() });
    }
  }

  private broadcastTradeExecuted(trade: any) {
    if (this.io) {
      this.io.emit('trade:executed', { trade, timestamp: Date.now() });
    }
  }
}

let botService: BotService | null = null;

export async function initializeBotService(io: Server): Promise<BotService> {
  if (!botService) {
    botService = new BotService();
    botService.setIO(io);
  }
  return botService;
}

export function getBotService(): BotService {
  if (!botService) {
    botService = new BotService();
  }
  return botService;
}
