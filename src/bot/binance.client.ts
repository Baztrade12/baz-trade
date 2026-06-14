import Binance from 'binance-api-node';
import logger from '../logger';
import { FundingRate, OrderBook, Trade } from '../types';

export class BinanceClient {
  private client: any;
  private wsClient: any;

  constructor(apiKey: string, apiSecret: string) {
    this.client = Binance({
      apiKey,
      apiSecret,
    });
  }

  async getFundingRates(symbols?: string[]): Promise<FundingRate[]> {
    try {
      const rates = await this.client.futuresFundingRate();
      if (symbols && symbols.length > 0) {
        return rates.filter((r: any) => symbols.includes(r.symbol));
      }
      return rates;
    } catch (error) {
      logger.error('Error fetching funding rates:', error);
      throw error;
    }
  }

  async getOrderBook(symbol: string, limit: number = 20): Promise<OrderBook> {
    try {
      const book = await this.client.futuresOrderBook({ symbol, limit });
      return {
        symbol,
        bids: book.bids,
        asks: book.asks,
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error(`Error fetching order book for ${symbol}:`, error);
      throw error;
    }
  }

  async openPosition(symbol: string, side: 'LONG' | 'SHORT', quantity: number, leverage: number): Promise<Trade> {
    try {
      const order = await this.client.futuresOrder({
        symbol,
        side: side === 'LONG' ? 'BUY' : 'SELL',
        type: 'MARKET',
        quantity,
        leverage,
      });

      return {
        id: order.clientOrderId,
        symbol,
        side: side === 'LONG' ? 'BUY' : 'SELL',
        quantity,
        price: order.avgPrice,
        timestamp: Date.now(),
        orderId: order.orderId,
        commission: 0, // Will calculate
        profitLoss: 0,
      };
    } catch (error) {
      logger.error(`Error opening position for ${symbol}:`, error);
      throw error;
    }
  }

  async closePosition(symbol: string, side: 'LONG' | 'SHORT', quantity: number): Promise<Trade> {
    try {
      const order = await this.client.futuresOrder({
        symbol,
        side: side === 'LONG' ? 'SELL' : 'BUY',
        type: 'MARKET',
        quantity,
      });

      return {
        id: order.clientOrderId,
        symbol,
        side: side === 'LONG' ? 'SELL' : 'BUY',
        quantity,
        price: order.avgPrice,
        timestamp: Date.now(),
        orderId: order.orderId,
        commission: 0,
        profitLoss: 0,
      };
    } catch (error) {
      logger.error(`Error closing position for ${symbol}:`, error);
      throw error;
    }
  }

  async getBalance(): Promise<any> {
    try {
      return await this.client.futuresAccountBalance();
    } catch (error) {
      logger.error('Error fetching balance:', error);
      throw error;
    }
  }

  async getOpenPositions(): Promise<any[]> {
    try {
      return await this.client.futuresOpenOrders();
    } catch (error) {
      logger.error('Error fetching open positions:', error);
      throw error;
    }
  }
}
