import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export async function initializeDatabase() {
  try {
    await prisma.$connect();
    logger.info('Database connected successfully');
  } catch (error) {
    logger.error(`Failed to connect to database: ${error}`);
    throw error;
  }
}

export async function disconnectDatabase() {
  await prisma.$disconnect();
}

export { prisma };
