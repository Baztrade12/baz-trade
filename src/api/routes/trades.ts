import express from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../../logger';

const router = express.Router();
const prisma = new PrismaClient();

// Get recent trades
router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const account = await prisma.account.findFirst();

    if (!account) {
      return res.json([]);
    }

    const trades = await prisma.trade.findMany({
      where: { accountId: account.id },
      orderBy: { executedAt: 'desc' },
      take: limit,
      skip: offset,
    });

    res.json(trades);
  } catch (error) {
    next(error);
  }
});

// Get trades by symbol
router.get('/:symbol', async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const account = await prisma.account.findFirst();

    if (!account) {
      return res.json([]);
    }

    const trades = await prisma.trade.findMany({
      where: { accountId: account.id, symbol },
      orderBy: { executedAt: 'desc' },
      take: limit,
    });

    res.json(trades);
  } catch (error) {
    next(error);
  }
});

// Get trade statistics
router.get('/stats/summary', async (req, res, next) => {
  try {
    const account = await prisma.account.findFirst();

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const trades = await prisma.trade.findMany({
      where: { accountId: account.id },
    });

    const totalTrades = trades.length;
    const winningTrades = trades.filter((t) => t.profitLoss > 0).length;
    const totalPnL = trades.reduce((sum, t) => sum + t.profitLoss, 0);
    const avgPnL = totalTrades > 0 ? totalPnL / totalTrades : 0;
    const bestTrade = Math.max(...trades.map((t) => t.profitLoss), 0);
    const worstTrade = Math.min(...trades.map((t) => t.profitLoss), 0);

    res.json({
      totalTrades,
      winningTrades,
      losingTrades: totalTrades - winningTrades,
      winRate: totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0,
      totalPnL,
      avgPnL,
      bestTrade,
      worstTrade,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
