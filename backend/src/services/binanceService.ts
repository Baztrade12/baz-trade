import ccxt from 'ccxt';
import logger from '../utils/logger';
import { Decimal } from 'decimal.js';

interface FundingRateData {
  symbol: string;
  fundingRate: number;
  nextFundingTime: number;
  timestamp: number;
}

interface OpenInterest {
  symbol: string;
  sumOpenInterest: number;
  sumOpenInterestValue: number;
  timestamp: number;
}

class BinanceService {
  private exchange: ccxt.binance;

  constructor() {
    this.exchange = new ccxt.binance({
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_API_SECRET,
      enableRateLimit: true,
      options: {
        defaultType: 'future',
        testnet: process.env.BINANCE_TEST_MODE === 'true'
      }
    });
  }

  /**
   * Get all funding rates for perpetual futures
   */
  async getAllFundingRates(): Promise<FundingRateData[]> {
    try {
      const response = await this.exchange.publicGetFuturesDataTopLongShortAccountRatio({
        // This endpoint requires custom implementation
      });
      return response;
    } catch (error) {
      logger.error(`Failed to get funding rates: ${error}`);
      throw error;
    }
  }

  /**
   * Get funding rate for specific symbol
   */
  async getFundingRate(symbol: string): Promise<FundingRateData | null> {
    try {
      const response = await (this.exchange as any).fetch8hFundingRate(symbol);
      return {
        symbol,
        fundingRate: response.fundingRate || 0,
        nextFundingTime: response.nextFundingTime || 0,
        timestamp: Date.now()
      };
    } catch (error) {
      logger.error(`Failed to get funding rate for ${symbol}: ${error}`);
      return null;
    }
  }

  /**
   * Place a market order
   */
  async placeMarketOrder(
    symbol: string,
    side: 'buy' | 'sell',
    amount: number,
    leverage: number = 1
  ) {
    try {
      await this.exchange.setLeverage(leverage, symbol);
      
      const order = await this.exchange.createMarketOrder(
        symbol,
        side,
        amount,
        undefined,
        { leverage }
      );

      logger.info(`Market order placed: ${side} ${amount} ${symbol}`);
      return order;
    } catch (error) {
      logger.error(`Failed to place market order: ${error}`);
      throw error;
    }
  }

  /**
   * Place limit order
   */
  async placeLimitOrder(
    symbol: string,
    side: 'buy' | 'sell',
    amount: number,
    price: number,
    leverage: number = 1
  ) {
    try {
      await this.exchange.setLeverage(leverage, symbol);
      
      const order = await this.exchange.createLimitOrder(
        symbol,
        side,
        amount,
        price,
        { leverage }
      );

      logger.info(`Limit order placed: ${side} ${amount} ${symbol} @ ${price}`);
      return order;
    } catch (error) {
      logger.error(`Failed to place limit order: ${error}`);
      throw error;
    }
  }

  /**
   * Get open positions
   */
  async getOpenPositions() {
    try {
      const positions = await this.exchange.fetchFundingHistory();
      return positions;
    } catch (error) {
      logger.error(`Failed to get open positions: ${error}`);
      throw error;
    }
  }

  /**
   * Get account balance
   */
  async getBalance() {
    try {
      const balance = await this.exchange.fetchBalance({ 'type': 'future' });
      return balance;
    } catch (error) {
      logger.error(`Failed to get balance: ${error}`);
      throw error;
    }
  }

  /**
   * Close position
   */
  async closePosition(symbol: string, amount: number) {
    try {
      const currentPosition = await (this.exchange as any).fetchPosition(symbol);
      const side = currentPosition.side === 'long' ? 'sell' : 'buy';
      
      const order = await this.exchange.createMarketOrder(
        symbol,
        side,
        amount
      );

      logger.info(`Position closed: ${symbol}`);
      return order;
    } catch (error) {
      logger.error(`Failed to close position: ${error}`);
      throw error;
    }
  }

  /**
   * Get mark price
   */
  async getMarkPrice(symbol: string): Promise<number> {
    try {
      const ticker = await this.exchange.fetchTicker(symbol);
      return ticker.last || 0;
    } catch (error) {
      logger.error(`Failed to get mark price for ${symbol}: ${error}`);
      return 0;
    }
  }

  /**
   * Calculate position size based on balance and leverage
   */
  calculatePositionSize(balance: number, leverage: number, riskPercentage: number = 5): number {
    const riskAmount = new Decimal(balance).times(riskPercentage).dividedBy(100);
    const positionSize = riskAmount.times(leverage);
    return positionSize.toNumber();
  }
}

export default BinanceService;
