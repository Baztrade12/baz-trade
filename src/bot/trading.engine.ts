import logger from '../logger';
import { BinanceClient } from './binance.client';
import { PortfolioManager } from './portfolio.manager';
import { ArbitrageOpportunity, Position } from '../types';
import { config } from '../config';

export class TradingEngine {
  private binanceClient: BinanceClient;
  private portfolioManager: PortfolioManager;
  private isRunning: boolean = false;
  private scanInterval: NodeJS.Timeout | null = null;
  private activePositions: Map<string, Position> = new Map();

  constructor(binanceClient: BinanceClient, portfolioManager: PortfolioManager) {
    this.binanceClient = binanceClient;
    this.portfolioManager = portfolioManager;
  }

  async start(): Promise<void> {
    this.isRunning = true;
    logger.info('Trading engine started');
    this.scanForOpportunities();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
    }
    await this.closeAllPositions();
    logger.info('Trading engine stopped');
  }

  private async scanForOpportunities(): Promise<void> {
    this.scanInterval = setInterval(async () => {
      try {
        const fundingRates = await this.binanceClient.getFundingRates();
        const opportunities = this.analyzeOpportunities(fundingRates);

        for (const opportunity of opportunities) {
          await this.executeArbitrage(opportunity);
        }
      } catch (error) {
        logger.error('Error scanning opportunities:', error);
      }
    }, config.trading.rebalanceIntervalMs);
  }

  private analyzeOpportunities(fundingRates: any[]): ArbitrageOpportunity[] {
    const opportunities: ArbitrageOpportunity[] = [];

    // Filter symbols with extreme funding rates
    fundingRates.forEach((rate) => {
      const absRate = Math.abs(parseFloat(rate.fundingRate));

      // Long opportunity: negative funding rate (shorters pay longs)
      if (parseFloat(rate.fundingRate) < -config.bot.minFundingRate) {
        opportunities.push({
          symbol: rate.symbol,
          longFundingRate: parseFloat(rate.fundingRate),
          shortFundingRate: 0,
          fundingPayoutTime: rate.nextFundingTime,
          estimatedProfit: this.calculateProfit(rate.symbol, parseFloat(rate.fundingRate), 'LONG'),
          confidence: Math.min(absRate / 0.1, 1), // Normalize to 0-1
        });
      }

      // Short opportunity: positive funding rate (longs pay shorters)
      if (parseFloat(rate.fundingRate) > config.bot.minFundingRate) {
        opportunities.push({
          symbol: rate.symbol,
          longFundingRate: 0,
          shortFundingRate: parseFloat(rate.fundingRate),
          fundingPayoutTime: rate.nextFundingTime,
          estimatedProfit: this.calculateProfit(rate.symbol, parseFloat(rate.fundingRate), 'SHORT'),
          confidence: Math.min(absRate / 0.1, 1),
        });
      }
    });

    return opportunities.sort((a, b) => b.confidence - a.confidence);
  }

  private calculateProfit(symbol: string, fundingRate: number, side: 'LONG' | 'SHORT'): number {
    const positionSize = config.bot.maxPositionSize;
    const leverage = config.bot.leverage;
    const profit = positionSize * leverage * Math.abs(fundingRate);
    return profit;
  }

  private async executeArbitrage(opportunity: ArbitrageOpportunity): Promise<void> {
    try {
      const minProfit = (config.bot.maxPositionSize * opportunity.estimatedProfit) / 100;
      const fees = (config.bot.maxPositionSize * 0.0004); // Estimated fees

      if (minProfit > fees) {
        const side = opportunity.longFundingRate < 0 ? 'LONG' : 'SHORT';
        logger.info(`Executing ${side} position for ${opportunity.symbol} (Profit: ${minProfit})`);

        const trade = await this.binanceClient.openPosition(
          opportunity.symbol,
          side,
          config.bot.maxPositionSize,
          config.bot.leverage
        );

        const position: Position = {
          id: trade.id,
          symbol: opportunity.symbol,
          side,
          quantity: config.bot.maxPositionSize,
          entryPrice: parseFloat(trade.price),
          leverage: config.bot.leverage,
          openTime: Date.now(),
          status: 'OPEN',
        };

        this.activePositions.set(trade.id, position);
        this.portfolioManager.recordTrade(trade);

        // Close position after funding rate payout
        this.schedulePositionClose(opportunity);
      }
    } catch (error) {
      logger.error(`Error executing arbitrage for ${opportunity.symbol}:`, error);
    }
  }

  private schedulePositionClose(opportunity: ArbitrageOpportunity): void {
    const timeUntilPayout = opportunity.fundingPayoutTime - Date.now();
    setTimeout(async () => {
      try {
        const side = opportunity.longFundingRate < 0 ? 'LONG' : 'SHORT';
        await this.binanceClient.closePosition(
          opportunity.symbol,
          side,
          config.bot.maxPositionSize
        );
        logger.info(`Closed ${side} position for ${opportunity.symbol}`);
      } catch (error) {
        logger.error(`Error closing position for ${opportunity.symbol}:`, error);
      }
    }, Math.max(timeUntilPayout - 5000, 0)); // Close 5 seconds before payout
  }

  private async closeAllPositions(): Promise<void> {
    for (const [, position] of this.activePositions) {
      try {
        await this.binanceClient.closePosition(position.symbol, position.side, position.quantity);
        logger.info(`Closed position ${position.id}`);
      } catch (error) {
        logger.error(`Error closing position ${position.id}:`, error);
      }
    }
    this.activePositions.clear();
  }

  getActivePositions(): Position[] {
    return Array.from(this.activePositions.values());
  }
}
