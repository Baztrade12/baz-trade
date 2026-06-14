import logger from '../logger';
import { BinanceClient } from './binance.client';
import { PortfolioMetrics, Trade } from '../types';

export class PortfolioManager {
  private binanceClient: BinanceClient;
  private trades: Trade[] = [];
  private metrics: PortfolioMetrics = {
    totalBalance: 0,
    availableBalance: 0,
    usedMargin: 0,
    marginRatio: 0,
    unrealizedPnL: 0,
    realizedPnL: 0,
    totalPnL: 0,
    roi: 0,
    winRate: 0,
    dailyReturn: 0,
    monthlyReturn: 0,
    yearlyReturn: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
  };

  constructor(binanceClient: BinanceClient) {
    this.binanceClient = binanceClient;
  }

  async initialize(): Promise<void> {
    try {
      await this.updateMetrics();
      logger.info('Portfolio manager initialized');
    } catch (error) {
      logger.error('Error initializing portfolio manager:', error);
      throw error;
    }
  }

  async updateMetrics(): Promise<void> {
    try {
      const balance = await this.binanceClient.getBalance();
      const positions = await this.binanceClient.getOpenPositions();

      const totalBalance = balance.reduce((sum: number, b: any) => sum + parseFloat(b.balance), 0);
      const usedMargin = positions.reduce((sum: number, p: any) => sum + parseFloat(p.initialMargin), 0);

      this.metrics = {
        totalBalance,
        availableBalance: totalBalance - usedMargin,
        usedMargin,
        marginRatio: usedMargin / totalBalance,
        unrealizedPnL: this.calculateUnrealizedPnL(),
        realizedPnL: this.calculateRealizedPnL(),
        totalPnL: this.calculateTotalPnL(),
        roi: this.calculateROI(totalBalance),
        winRate: this.calculateWinRate(),
        dailyReturn: this.calculateReturn('daily'),
        monthlyReturn: this.calculateReturn('monthly'),
        yearlyReturn: this.calculateReturn('yearly'),
        sharpeRatio: this.calculateSharpeRatio(),
        maxDrawdown: this.calculateMaxDrawdown(),
      };
    } catch (error) {
      logger.error('Error updating metrics:', error);
    }
  }

  recordTrade(trade: Trade): void {
    this.trades.push(trade);
    this.updateMetrics();
  }

  private calculateUnrealizedPnL(): number {
    return 0; // Will implement with real position data
  }

  private calculateRealizedPnL(): number {
    return this.trades.reduce((sum, trade) => sum + trade.profitLoss, 0);
  }

  private calculateTotalPnL(): number {
    return this.calculateUnrealizedPnL() + this.calculateRealizedPnL();
  }

  private calculateROI(totalBalance: number): number {
    if (totalBalance === 0) return 0;
    return (this.calculateTotalPnL() / totalBalance) * 100;
  }

  private calculateWinRate(): number {
    if (this.trades.length === 0) return 0;
    const winningTrades = this.trades.filter((t) => t.profitLoss > 0).length;
    return (winningTrades / this.trades.length) * 100;
  }

  private calculateReturn(period: 'daily' | 'monthly' | 'yearly'): number {
    const now = Date.now();
    let timeRange = 0;

    if (period === 'daily') timeRange = 24 * 60 * 60 * 1000;
    else if (period === 'monthly') timeRange = 30 * 24 * 60 * 60 * 1000;
    else if (period === 'yearly') timeRange = 365 * 24 * 60 * 60 * 1000;

    const periodTrades = this.trades.filter((t) => now - t.timestamp <= timeRange);
    const periodPnL = periodTrades.reduce((sum, t) => sum + t.profitLoss, 0);
    return (periodPnL / this.metrics.totalBalance) * 100;
  }

  private calculateSharpeRatio(): number {
    // Simplified Sharpe ratio calculation
    if (this.trades.length === 0) return 0;
    const returns = this.trades.map((t) => (t.profitLoss / this.metrics.totalBalance) * 100);
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252); // Annualized
  }

  private calculateMaxDrawdown(): number {
    if (this.trades.length === 0) return 0;
    let maxBalance = this.metrics.totalBalance;
    let maxDrawdown = 0;

    this.trades.forEach((trade) => {
      const currentBalance = this.metrics.totalBalance - (this.calculateTotalPnL() - trade.profitLoss);
      if (currentBalance > maxBalance) {
        maxBalance = currentBalance;
      }
      const drawdown = ((maxBalance - currentBalance) / maxBalance) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });

    return maxDrawdown;
  }

  getMetrics(): PortfolioMetrics {
    return { ...this.metrics };
  }

  getTrades(): Trade[] {
    return [...this.trades];
  }
}
