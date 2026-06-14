import express from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../../logger';

const router = express.Router();
const prisma = new PrismaClient();

// Get bot status
router.get('/', async (req, res, next) => {
  try {
    let botState = await prisma.botState.findFirst();

    if (!botState) {
      botState = await prisma.botState.create({
        data: {},
      });
    }

    const totalTrades = await prisma.trade.count();
    const successfulTrades = await prisma.trade.count({
      where: { profitLoss: { gt: 0 } },
    });
    const failedTrades = await prisma.trade.count({
      where: { profitLoss: { lte: 0 } },
    });

    res.json({
      isRunning: botState.isRunning,
      uptime: botState.uptime,
      totalTrades,
      successfulTrades,
      failedTrades,
      lastStartTime: botState.lastStartTime,
      lastStopTime: botState.lastStopTime,
    });
  } catch (error) {
    next(error);
  }
});

// Start bot
router.post('/start', async (req, res, next) => {
  try {
    let botState = await prisma.botState.findFirst();

    if (!botState) {
      botState = await prisma.botState.create({
        data: { isRunning: true, lastStartTime: new Date() },
      });
    } else {
      botState = await prisma.botState.update({
        where: { id: botState.id },
        data: { isRunning: true, lastStartTime: new Date() },
      });
    }

    logger.info('Bot started via API');
    res.json({ success: true, message: 'Bot started' });
  } catch (error) {
    next(error);
  }
});

// Stop bot
router.post('/stop', async (req, res, next) => {
  try {
    let botState = await prisma.botState.findFirst();

    if (!botState) {
      botState = await prisma.botState.create({
        data: { isRunning: false, lastStopTime: new Date() },
      });
    } else {
      botState = await prisma.botState.update({
        where: { id: botState.id },
        data: { isRunning: false, lastStopTime: new Date() },
      });
    }

    logger.info('Bot stopped via API');
    res.json({ success: true, message: 'Bot stopped' });
  } catch (error) {
    next(error);
  }
});

export default router;
