import { PrismaClient } from '@prisma/client';
import { PortfolioMetrics } from '../types';
import logger from '../logger';

const prisma = new PrismaClient();

export class DatabaseService {
  static async getOrCreateAccount() {
    let account = await prisma.account.findFirst();

    if (!account) {
      account = await prisma.account.create({
        data: {},
      });
      logger.info(`Created new account: ${account.id}`);
    }

    return account;
  }

  static async updateAccountBalance(totalBalance: number, availableBalance: number, usedMargin: number) {
    const account = await this.getOrCreateAccount();

    return await prisma.account.update({
      where: { id: account.id },
      data: {
        totalBalance,
        availableBalance,
        usedMargin,
      },
    });
  }

  static async recordTrade(
    symbol: string,
    side: 'BUY' | 'SELL',
    quantity: number,
    price: number,
    orderId: string,
    commission: number,
    profitLoss: number = 0,
    fundingRate: number = 0
  ) {
    const account = await this.getOrCreateAccount();

    return await prisma.trade.create({
      data: {
        accountId: account.id,
        symbol,
        side,
        quantity,
        price,
        orderId,
        commission,
        profitLoss,
        fundingRate,
        isFundingTrade: fundingRate !== 0,
      },
    });
  }

  static async openPosition(
    symbol: string,
    side: 'LONG' | 'SHORT',
    quantity: number,
    entryPrice: number,
    leverage: number
  ) {
    const account = await this.getOrCreateAccount();

    return await prisma.position.create({
      data: {
        accountId: account.id,
        symbol,
        side,
        quantity,
        entryPrice,
        leverage,
        status: 'OPEN',
      },
    });
  }

  static async closePosition(positionId: string, realizedPnL: number, fundingPaid: number) {
    return await prisma.position.update({
      where: { id: positionId },
      data: {
        status: 'CLOSED',
        closeTime: new Date(),
        realizedPnL,
        fundingPaid,
      },
    });
  }

  static async recordPortfolioMetrics(metrics: PortfolioMetrics) {
    const account = await this.getOrCreateAccount();

    return await prisma.portfolioMetrics.create({
      data: {
        accountId: account.id,
        ...metrics,
      },
    });
  }

  static async recordTradingLog(
    action: string,
    success: boolean,
    symbol?: string,
    details?: Record<string, any>
  ) {
    return await prisma.tradingLog.create({
      data: {
        action,
        success,
        symbol,
        details: JSON.stringify(details || {}),
      },
    });
  }

  static async saveFundingRateSnapshot(
    symbol: string,
    fundingRate: number,
    fundingTime: Date,
    nextFundingTime: Date
  ) {
    return await prisma.fundingRateSnapshot.create({
      data: {
        symbol,
        fundingRate,
        fundingTime,
        nextFundingTime,
      },
    });
  }

  static async getOpenPositions() {
    const account = await this.getOrCreateAccount();

    return await prisma.position.findMany({
      where: {
        accountId: account.id,
        status: 'OPEN',
      },
    });
  }

  static async getRecentTrades(limit: number = 100) {
    const account = await this.getOrCreateAccount();

    return await prisma.trade.findMany({
      where: { accountId: account.id },
      orderBy: { executedAt: 'desc' },
      take: limit,
    });
  }

  static async getPortfolioMetrics() {
    const account = await this.getOrCreateAccount();

    return await prisma.portfolioMetrics.findFirst({
      where: { accountId: account.id },
      orderBy: { timestamp: 'desc' },
    });
  }
}

export default DatabaseService;
