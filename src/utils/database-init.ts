import { PrismaClient } from '@prisma/client';
import logger from '../logger';

const prisma = new PrismaClient();

export async function initializeDatabase() {
  try {
    // Check connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection established');

    // Create initial account if none exists
    const account = await prisma.account.findFirst();
    if (!account) {
      await prisma.account.create({
        data: {
          totalBalance: 0,
          availableBalance: 0,
          usedMargin: 0,
        },
      });
      logger.info('Initial account created');
    }

    // Create initial bot state if none exists
    const botState = await prisma.botState.findFirst();
    if (!botState) {
      await prisma.botState.create({
        data: {
          isRunning: false,
        },
      });
      logger.info('Initial bot state created');
    }
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

export default initializeDatabase;
