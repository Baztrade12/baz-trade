import express from 'express';
import { prisma } from '../../db/database';
import logger from '../../utils/logger';

const router = express.Router();

// Get all trades
router.get('/', async (req, res) => {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: { entryTime: 'desc' },
      take: 100
    });
    res.json(trades);
  } catch (error) {
    logger.error(`Error fetching trades: ${error}`);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

// Get trade by ID
router.get('/:id', async (req, res) => {
  try {
    const trade = await prisma.trade.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    
    res.json(trade);
  } catch (error) {
    logger.error(`Error fetching trade: ${error}`);
    res.status(500).json({ error: 'Failed to fetch trade' });
  }
});

export default router;
