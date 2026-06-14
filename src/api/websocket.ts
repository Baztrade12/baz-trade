import { Server as SocketIOServer, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import logger from '../logger';

const prisma = new PrismaClient();

export function initializeWebSocket(io: SocketIOServer) {
  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Subscribe to dashboard updates
    socket.on('subscribe:dashboard', async () => {
      try {
        const account = await prisma.account.findFirst();
        if (!account) {
          logger.warn('No account found in database');
          return;
        }

        // Send initial portfolio data
        const latestMetrics = await prisma.portfolioMetrics.findFirst({
          where: { accountId: account.id },
          orderBy: { timestamp: 'desc' },
        });

        socket.emit('portfolio:update', latestMetrics || getDefaultMetrics());

        // Send active positions
        const positions = await prisma.position.findMany({
          where: { accountId: account.id, status: 'OPEN' },
        });
        socket.emit('positions:update', positions);

        // Send recent trades
        const trades = await prisma.trade.findMany({
          where: { accountId: account.id },
          orderBy: { executedAt: 'desc' },
          take: 50,
        });
        socket.emit('trades:update', trades);

        // Send bot status
        const botState = await prisma.botState.findFirst();
        socket.emit('bot:status', botState || getDefaultBotStatus());

        // Join room for live updates
        socket.join('dashboard');
        logger.info(`Client subscribed to dashboard: ${socket.id}`);
      } catch (error) {
        logger.error('Error subscribing to dashboard:', error);
      }
    });

    // Start bot
    socket.on('bot:start', async () => {
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

        logger.info('Bot started via WebSocket');
        io.to('dashboard').emit('bot:status', botState);
      } catch (error) {
        logger.error('Error starting bot:', error);
      }
    });

    // Stop bot
    socket.on('bot:stop', async () => {
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

        logger.info('Bot stopped via WebSocket');
        io.to('dashboard').emit('bot:status', botState);
      } catch (error) {
        logger.error('Error stopping bot:', error);
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  // Emit portfolio updates every 5 seconds
  setInterval(async () => {
    try {
      const account = await prisma.account.findFirst();
      if (!account) return;

      const latestMetrics = await prisma.portfolioMetrics.findFirst({
        where: { accountId: account.id },
        orderBy: { timestamp: 'desc' },
      });

      if (latestMetrics) {
        io.to('dashboard').emit('portfolio:update', latestMetrics);
      }

      const positions = await prisma.position.findMany({
        where: { accountId: account.id, status: 'OPEN' },
      });
      io.to('dashboard').emit('positions:update', positions);
    } catch (error) {
      logger.error('Error emitting updates:', error);
    }
  }, 5000);
}

function getDefaultMetrics() {
  return {
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
}

function getDefaultBotStatus() {
  return {
    isRunning: false,
    uptime: 0,
    totalTrades: 0,
    successfulTrades: 0,
    failedTrades: 0,
  };
}
