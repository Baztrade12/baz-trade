import express from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../../logger';

const router = express.Router();
const prisma = new PrismaClient();

// Get active positions
router.get('/', async (req, res, next) => {
  try {
    const account = await prisma.account.findFirst();

    if (!account) {
      return res.json([]);
    }

    const positions = await prisma.position.findMany({
      where: {
        accountId: account.id,
        status: 'OPEN',
      },
    });

    res.json(positions);
  } catch (error) {
    next(error);
  }
});

// Get closed positions
router.get('/closed', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const account = await prisma.account.findFirst();

    if (!account) {
      return res.json([]);
    }

    const positions = await prisma.position.findMany({
      where: {
        accountId: account.id,
        status: { in: ['CLOSED', 'LIQUIDATED'] },
      },
      orderBy: { closeTime: 'desc' },
      take: limit,
      skip: offset,
    });

    res.json(positions);
  } catch (error) {
    next(error);
  }
});

export default router;
