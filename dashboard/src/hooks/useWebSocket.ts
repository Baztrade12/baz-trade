'use client';

import { useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { useDashboardStore } from '../store/dashboard.store';
import { PortfolioMetrics, Position, Trade, BotStatus } from '../types';

let socket: Socket | null = null;

export const useWebSocket = () => {
  const {
    setPortfolio,
    setPositions,
    setTrades,
    setBotStatus,
    setConnected,
    setLoading,
  } = useDashboardStore();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

    // Connect to WebSocket
    socket = io(apiUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('Connected to bot API');
      setConnected(true);
      socket?.emit('subscribe:dashboard');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from bot API');
      setConnected(false);
    });

    // Listen for updates
    socket.on('portfolio:update', (data: PortfolioMetrics) => {
      setPortfolio(data);
      setLoading(false);
    });

    socket.on('positions:update', (data: Position[]) => {
      setPositions(data);
    });

    socket.on('trades:update', (data: Trade[]) => {
      setTrades(data);
    });

    socket.on('bot:status', (data: BotStatus) => {
      setBotStatus(data);
    });

    socket.on('trade:executed', (trade: Trade) => {
      useDashboardStore.setState((state) => ({
        trades: [trade, ...state.trades],
      }));
    });

    socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('portfolio:update');
        socket.off('positions:update');
        socket.off('trades:update');
        socket.off('bot:status');
        socket.off('trade:executed');
        socket.disconnect();
      }
    };
  }, []);

  const emit = (event: string, data?: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    }
  };

  return { emit };
};
