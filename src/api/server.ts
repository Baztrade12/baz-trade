import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import logger from '../logger';
import { config } from '../config';
import statusRoutes from './routes/status';
import portfolioRoutes from './routes/portfolio';
import positionsRoutes from './routes/positions';
import tradesRoutes from './routes/trades';
import { initializeWebSocket } from './websocket';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/status', statusRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/positions', positionsRoutes);
app.use('/api/trades', tradesRoutes);

// WebSocket
initializeWebSocket(io);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('API Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  });
});

// Start server
const port = config.dashboard.apiPort;
httpServer.listen(port, () => {
  logger.info(`API Server listening on port ${port}`);
});

export { app, io, httpServer };
