import express from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../../logger';

const router = express.Router();
const prisma = new PrismaClient();

// Get portfolio metrics
router.get('/', async (req, res, next) => {
  try {
    const account = await prisma.account.findFirst();

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const latestMetrics = await prisma.portfolioMetrics.findFirst({
      where: { accountId: account.id },
      orderBy: { timestamp: 'desc' },
    });

    res.json(latestMetrics || {
      totalBalance: account.totalBalance,
      availableBalance: account.availableBalance,
      usedMargin: account.usedMargin,
      marginRatio: account.usedMargin / Math.max(account.totalBalance, 1),
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
    });
  } catch (error) {
    next(error);
  }
});

// Get portfolio history
router.get('/history', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const account = await prisma.account.findFirst();

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const metrics = await prisma.portfolioMetrics.findMany({
      where: { accountId: account.id },
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
    });

    res.json(metrics);
  } catch (error) {
    next(error);
  }
});

export default router;
