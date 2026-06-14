import express from 'express';
import { prisma } from '../../db/database';
import logger from '../../utils/logger';
import Decimal from 'decimal.js';

const router = express.Router();

// Get portfolio summary
router.get('/summary', async (req, res) => {
  try {
    const trades = await prisma.trade.findMany();
    
    let totalProfit = new Decimal(0);
    let totalFees = new Decimal(0);
    let totalTrades = trades.length;
    let winningTrades = 0;
    let losingTrades = 0;

    for (const trade of trades) {
      if (trade.profit) {
        totalProfit = totalProfit.plus(trade.profit);
        if (trade.profit > 0) winningTrades++;
        else if (trade.profit < 0) losingTrades++;
      }
      if (trade.fees) {
        totalFees = totalFees.plus(trade.fees);
      }
    }

    const winRate = totalTrades > 0 ? (winningTrades / totalTrades * 100).toFixed(2) : 0;

    res.json({
      totalProfit: totalProfit.toNumber(),
      totalFees: totalFees.toNumber(),
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      netProfit: totalProfit.minus(totalFees).toNumber()
    });
  } catch (error) {
    logger.error(`Error fetching portfolio summary: ${error}`);
    res.status(500).json({ error: 'Failed to fetch portfolio summary' });
  }
});

// Get portfolio performance
router.get('/performance', async (req, res) => {
  try {
    const { period = 'daily' } = req.query;
    
    const trades = await prisma.trade.findMany({
      where: { status: 'closed' },
      orderBy: { exitTime: 'asc' }
    });

    // Group trades by period
    const performance: any = {};

    for (const trade of trades) {
      if (!trade.exitTime || !trade.profit) continue;

      let key = '';
      const date = trade.exitTime;

      if (period === 'daily') {
        key = date.toISOString().split('T')[0];
      } else if (period === 'monthly') {
        key = date.toISOString().substring(0, 7);
      } else if (period === 'yearly') {
        key = date.toISOString().substring(0, 4);
      }

      if (!performance[key]) {
        performance[key] = { profit: 0, trades: 0, wins: 0 };
      }

      performance[key].profit += trade.profit;
      performance[key].trades += 1;
      if (trade.profit > 0) performance[key].wins += 1;
    }

    res.json(performance);
  } catch (error) {
    logger.error(`Error fetching portfolio performance: ${error}`);
    res.status(500).json({ error: 'Failed to fetch portfolio performance' });
  }
});

export default router;
